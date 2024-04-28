import { refreshTokens } from '@/shared/lib/token'
import { now } from '@/shared/utils/time'
import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { useRouter } from 'solito/router'

const SESSION_STORAGE_KEY = 'imoblr-session'
const API_URL = process.env.PUBLIC_API_URL

const __IMOBLR_SESSION = {
  _session: undefined,
  _router: undefined,
  _lastSync: 0,
  _setSession: () => { },
} as {
  _session: Session | null | undefined
  _router: any
  _lastSync: number
  _setSession: (session?: Session) => Session | undefined
  _getSession: (...args: any[]) => any
}

type Session = {
  accessToken?: string
  refreshToken?: string
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

export const SessionContext = React.createContext?.<SessionContextValue | undefined>(undefined)

export function useSession(options?: UseSessionOptions): SessionContextValue | undefined {
  if (!SessionContext) {
    throw new Error('React Context is unavailable in Server Components')
  }

  const value: SessionContextValue | undefined = React.useContext(SessionContext)
  if (!value && process.env.NODE_ENV !== 'production') {
    throw new Error('[next-auth]: `useSession` must be wrapped in a <SessionProvider />')
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
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams,
): Promise<Session | null | undefined> {
  console.log(`SIGNIN WITH PROVIDER ${provider} in NATIVE`)

  const body = JSON.stringify({
    email: authorizationParams?.email,
    password: authorizationParams?.password,
  })
  const headers = { 'Content-Type': 'application/json' }
  const resp = await fetch(`${API_URL}/signin`, { method: 'POST', body, headers })

  if (resp.ok) {
    const { access_token: accessToken, refresh_token: refreshToken } = await resp.json()
    const session = { refreshToken, accessToken }
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(session))
    __IMOBLR_SESSION._session = session

    if (options?.redirect && options.callbackUrl) {
      __IMOBLR_SESSION._router.replace(options.callbackUrl)
      return
    }
  }

  return __IMOBLR_SESSION._session
}

export async function signOut(signoutOptions?: SignoutOptions) {
  const { deleteOnServer, redirect = true, callbackUrl = '/' } = signoutOptions ?? {}
  const refreshToken = __IMOBLR_SESSION._session?.refreshToken
  if (deleteOnServer && refreshToken) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${__IMOBLR_SESSION._session?.refreshToken}`,
    }
    await fetch(`${API_URL}/signout`, { method: 'POST', headers })
  }

  await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY)
  __IMOBLR_SESSION._session = undefined

  if (redirect) return __IMOBLR_SESSION._router.replace(callbackUrl)
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
        __IMOBLR_SESSION._lastSync = now()
        __IMOBLR_SESSION._session = await getSession()
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
      __IMOBLR_SESSION._getSession = () => { }
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
        const resp = await refreshTokens(session?.refreshToken)
        if (!resp.ok) return await signOut()
        const newSession = {
          accessToken: resp.accessToken,
          refreshToken: resp.refreshToken,
        }
        await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(newSession))
        setSession(newSession)
        return newSession
      },
    }),
    [session, loading],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
