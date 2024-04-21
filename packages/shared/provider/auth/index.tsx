import { AuthContext, type AuthPropsState, type SecureStoreData } from '@/shared/context/auth'
import { isValidToken } from '@/shared/lib/jwt'
import { refreshTokens } from '@/shared/lib/token'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { useRouter } from 'solito/router'

const SESSION_STORAGE_KEY = 'imoblr-session'
const API_URL = process.env.EXPO_PUBLIC_API_URL

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthPropsState>({})
  const router = useRouter()

  useEffect(() => {
    const onSessionLoad = async () => {
      const storedSession = await SecureStore.getItemAsync(SESSION_STORAGE_KEY)
      if (!storedSession) return
      const decodedStoredSession = JSON.parse(storedSession) as SecureStoreData
      const refreshTokenIsValid = isValidToken(decodedStoredSession.refreshToken)
      console.log('onSessionLoad', { refreshTokenIsValid })
      if (!refreshTokenIsValid) return await onRefreshTokenExpired()
      setAuthState({
        accessToken: decodedStoredSession.accessToken,
        refreshToken: decodedStoredSession.refreshToken,
      })
      router.replace('/dashboard')
    }
    onSessionLoad()
  }, [router.replace])

  const onLogin = async (email: string, password: string) => {
    const body = JSON.stringify({ email, password })
    const headers = { 'Content-Type': 'application/json' }
    const resp = await fetch(`${API_URL}/signin`, { method: 'POST', body, headers })

    if (resp.ok) {
      const { access_token: accessToken, refresh_token: refreshToken } = await resp.json()
      const authData = { refreshToken, accessToken }
      await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(authData))
      setAuthState({
        accessToken,
        refreshToken,
      })
    }

    return resp
  }

  const onLogout = async () => {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authState.accessToken}`,
    }
    await fetch(`${API_URL}/signout`, { method: 'POST', headers })
    await onRefreshTokenExpired()
  }

  const onAccessTokenExpired = async () => {
    console.log('onAccessTokenExpired', { refreshToken: authState.refreshToken })
    const resp = await refreshTokens(authState.refreshToken)
    console.log('onAccessTokenExpired->refreshTokens', { resp })
    if (!resp.ok) return await onRefreshTokenExpired()
    const session = {
      accessToken: resp.accessToken,
      refreshToken: resp.refreshToken,
    }
    await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(session))
    setAuthState(session)
    return session
  }

  const onRefreshTokenExpired = async () => {
    console.log('onRefreshTokenExpired')
    await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY)
    setAuthState({})
    return router.replace('/')
  }

  const value = {
    loaded: false,
    onLogin,
    onLogout,
    onAccessTokenExpired,
    onRefreshTokenExpired,
    state: authState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
