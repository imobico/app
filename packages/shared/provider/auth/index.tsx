// import { type AuthProps, type AuthPropsState, type SecureStoreData, SessionContext } from '@/shared/context/auth'
// import { isValidToken } from '@/shared/lib/jwt'
// import { refreshTokens } from '@/shared/lib/token'
// import * as SecureStore from 'expo-secure-store'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'solito/router'

// const SESSION_STORAGE_KEY = 'imoblr-session'
// const API_URL = process.env.PUBLIC_API_URL

// export const AuthProvider = ({ children }: React.PropsWithChildren) => {
//   const [session, setSession] = useState<AuthPropsState>({})
//   const router = useRouter()

//   useEffect(() => {
//     const onSessionLoad = async () => {
//       const storedSession = await SecureStore.getItemAsync(SESSION_STORAGE_KEY)
//       if (!storedSession) return
//       const decodedStoredSession = JSON.parse(storedSession) as SecureStoreData
//       const refreshTokenIsValid = isValidToken(decodedStoredSession.refreshToken)
//       console.log('onSessionLoad', { refreshTokenIsValid })
//       if (!refreshTokenIsValid) return await signOut()
//       setSession({
//         accessToken: decodedStoredSession.accessToken,
//         refreshToken: decodedStoredSession.refreshToken,
//       })
//       router.replace('/dashboard')
//     }
//     onSessionLoad()
//   }, [router.replace])

//   const signIn = async (email: string, password: string) => {
//     const body = JSON.stringify({ email, password })
//     const headers = { 'Content-Type': 'application/json' }
//     const resp = await fetch(`${API_URL}/signin`, { method: 'POST', body, headers })

//     if (resp.ok) {
//       const { access_token: accessToken, refresh_token: refreshToken } = await resp.json()
//       const authData = { refreshToken, accessToken }
//       await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(authData))
//       setSession({
//         accessToken,
//         refreshToken,
//       })
//     }

//     return resp
//   }

//   const signOut = async (deleteOnServer = false) => {
//     if (deleteOnServer) {
//       const headers = {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${session.accessToken}`,
//       }
//       await fetch(`${API_URL}/signout`, { method: 'POST', headers })
//     }

//     await SecureStore.deleteItemAsync(SESSION_STORAGE_KEY)
//     setSession({})
//     return router.replace('/')
//   }

//   const update = async () => {
//     const resp = await refreshTokens(session.refreshToken)
//     if (!resp.ok) return await signOut()
//     const newSession = {
//       accessToken: resp.accessToken,
//       refreshToken: resp.refreshToken,
//     }
//     await SecureStore.setItemAsync(SESSION_STORAGE_KEY, JSON.stringify(newSession))
//     setSession(newSession)
//     return newSession
//   }

//   const value = {
//     status: "unauthenticated",
//     data: session,
//     signIn,
//     signOut,
//     update,
//   } satisfies AuthProps

//   return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
// }
