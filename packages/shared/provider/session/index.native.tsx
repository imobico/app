import { refreshTokenFn } from '@imoblr/shared/utils/jwt'
import { now } from '@imoblr/shared/utils/time'
import { User } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React from 'react'

const SESSION_STORAGE_KEY = 'imoblr-session'
const API_URL = process.env.EXPO_PUBLIC_API_URL

const __IMOBLR_SESSION = {
  _session: undefined,
  _router: undefined,
  _lastSync: 0,
  _setSession: () => {},
} as {
  _session: Session | null | undefined
  _router: any
  _lastSync: number
  _setSession: (session?: Session) => Session | undefined
  _getSession: () => any
}

type Session = {
  user: {
    accessToken?: string
    refreshToken?: string
  }
}

interface UseSessionOptions {
  required?: boolean
  onUnauthenticated?: () => void
}

interface SignInOptions extends Record<string, unknown> {
  callbackUrl?: string
  redirect?: boolean
}

interface SignoutOptions extends Record<string, unknown> {
  deleteOnServer?: boolean
  redirect?: boolean
  callbackUrl?: string
}

interface SessionProviderProps {
  children: React.ReactNode
  session?: Session | null
  refetchInterval?: number
}

interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
}

type UpdateSession = (data?: Session | null) => Promise<Session | null>

type SessionContextValue = {
  update: UpdateSession
  data: Session | null
  status: 'authenticated' | 'unauthenticated' | 'loading'
}

type SignInAuthorizationParams = {
  email: string
  password: string
}

export const SessionContext = React.createContext?.<SessionContextValue>({} as SessionContextValue)

export function useSession(options?: UseSessionOptions): SessionContextValue {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components')
  }

  const value: SessionContextValue = React.useContext(SessionContext)
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error('[imoblr-auth]: `useSession` must be wrapped in a <SessionProvider />')
  }

  const { required, onUnauthenticated } = options ?? {}

  const requiredAndNotLoading = required && value?.status === 'unauthenticated'

  React.useEffect(() => {
    if (requiredAndNotLoading) {
      if (onUnauthenticated) onUnauthenticated()
    }
  }, [requiredAndNotLoading, onUnauthenticated])

  if (requiredAndNotLoading && value) {
    return {
      data: value.data,
      update: value.update,
      status: 'loading',
    }
  }

  return value
}

export async function signIn(
  provider?: string,
  options?: SignInOptions & SignInAuthorizationParams,
): Promise<SignInResponse | undefined> {
  try {
    console.log(`SIGNIN WITH PROVIDER ${provider} in NATIVE ${JSON.stringify(options)}`)

    const body = JSON.stringify({
      email: options?.email,
      password: options?.password,
    })

    const headers = { 'Content-Type': 'application/json' }
    const resp = await fetch(`${API_URL}/signin`, { method: 'POST', body, headers })
    const respBody = await resp.json()
    const error = respBody?.errors?.detail

    if (resp.status === 201) {
      const { access_token: accessToken, refresh_token: refreshToken } = respBody
      const session: Session = { user: { refreshToken, accessToken } }
      await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(session))
      __IMOBLR_SESSION._session = session
      await __IMOBLR_SESSION._getSession()

      return {
        error,
        status: resp.status,
        ok: true,
      }
    }

    return {
      error,
      status: resp.status,
      ok: false,
    }
  } catch (error) {
    console.error(error)
  }
}

export async function signOut(signoutOptions?: SignoutOptions) {
  const { deleteOnServer, redirect = true, callbackUrl = '/' } = signoutOptions ?? {}
  const refreshToken = __IMOBLR_SESSION._session?.user?.refreshToken
  if (deleteOnServer && refreshToken) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${__IMOBLR_SESSION._session?.user?.refreshToken}`,
    }
    await fetch(`${API_URL}/signout`, { method: 'POST', headers })
  }

  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY)
  __IMOBLR_SESSION._session = undefined

  if (redirect) {
    __IMOBLR_SESSION._router.replace(callbackUrl)
    return
  }
}

export async function getSession() {
  const sessionJSON = await SecureStore.getItemAsync(SESSION_STORAGE_KEY)
  if (sessionJSON) {
    const session = JSON.parse(sessionJSON)
    return session
  }
  return
}

export function SessionProvider(props: SessionProviderProps) {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components')
  }
  __IMOBLR_SESSION._router = useRouter()
  const { children, refetchInterval } = props

  const hasInitialSession = props.session !== undefined
  __IMOBLR_SESSION._lastSync = hasInitialSession ? now() : 0

  const [session, setSession] = React.useState(() => {
    if (hasInitialSession) __IMOBLR_SESSION._session = props.session
    return props.session
  })

  const [loading, setLoading] = React.useState(!hasInitialSession)

  React.useEffect(() => {
    __IMOBLR_SESSION._getSession = async () => {
      try {
        const data = await getSession()
        __IMOBLR_SESSION._session = data
        setSession(__IMOBLR_SESSION._session)
      } catch (error) {
        console.error('client session error', error)
      } finally {
        setLoading(false)
      }
    }

    __IMOBLR_SESSION._getSession()

    return () => {
      __IMOBLR_SESSION._lastSync = 0
      __IMOBLR_SESSION._session = undefined
      __IMOBLR_SESSION._getSession = () => {}
    }
  }, [])

  React.useEffect(() => {
    if (refetchInterval) {
      const refetchIntervalTimer = setInterval(() => {
        if (__IMOBLR_SESSION._session) {
          __IMOBLR_SESSION._getSession()
        }
      }, refetchInterval * 1000)
      return () => clearInterval(refetchIntervalTimer)
    }
  }, [refetchInterval])

  const value: any = React.useMemo(
    () => ({
      data: session,
      status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
      async update() {
        const refreshToken = session?.user?.refreshToken
        if (!refreshToken) return await signOut({ callbackUrl: '/entrar' })
        const headers = {
          Authorization: `Bearer ${refreshToken}`,
          'Content-Type': 'application/json',
        }
        const opts = { method: 'POST', headers }
        const resp = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/token/refresh`, opts)
        if (resp.status !== 201) {
          return
        }
        const data = await resp.json()
        const newTokens = {
          refreshToken: data.refresh_token,
          accessToken: data.access_token,
        }
        const updatedSession = { user: { ...session?.user, ...newTokens } }
        await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(updatedSession))
        setSession(updatedSession)
        return updatedSession
      },
    }),
    [session, loading],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
function useFocusEffect(arg0: () => void) {
  throw new Error('Function not implemented.')
}
