import { type Account, AuthError, type Profile, type Session } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { SignInResponse } from '@imoblr/shared/types/api'
import { decodeJWT, getTokenDurationInSecs, refreshTokenFn } from '@imoblr/shared/utils/jwt'

type CheckTokenResponse = 'unauthorized' | 'update' | 'valid'

const checkTokens = (
  refreshToken: string | undefined,
  accessToken: string | undefined,
): CheckTokenResponse => {
  if (!refreshToken) return 'unauthorized'
  const refreshTokenDuration = getTokenDurationInSecs(refreshToken)
  const accessTokenDuration = getTokenDurationInSecs(accessToken)
  if (refreshTokenDuration <= 0) return 'unauthorized'
  if (refreshTokenDuration <= 180 || accessTokenDuration <= 120) return 'update'
  return 'valid'
}

export default {
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<SignInResponse | null> {
        console.log('calling authorize')
        const baseUrl = process.env.NEXT_PUBLIC_API_URL

        try {
          const res = await fetch(`${baseUrl}/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          if (res.ok && res.status === 201) {
            const body = await res.json()
            return {
              ...body.data.user,
              refreshToken: body.refresh_token,
              accessToken: body.access_token,
            }
          }
          return null
        } catch (error) {
          console.error(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPrivatePath =
        nextUrl.pathname.startsWith('/app') || nextUrl.pathname.startsWith('/dashboard')
      if (isPrivatePath && isLoggedIn) return true
      if (isPrivatePath) return false

      return true
    },
    async jwt({
      token,
      user,
      account,
      session,
      trigger,
    }: {
      token: JWT
      user: any
      account: Account | null
      session?: any
      trigger?: 'signIn' | 'signUp' | 'update' | undefined
      profile?: Profile | undefined
      isNewUser?: boolean | undefined
    }): Promise<JWT | null> {
      if (session?.forceUpdate) {
        const refreshToken = token?.refreshToken as string
        const updatedTokens = await refreshTokenFn(refreshToken)
        if (updatedTokens) return { ...token, ...session.user, ...updatedTokens }
        throw new AuthError('authentication token expired')
      }

      if (trigger === 'signIn' && user && account) return user

      const refreshToken = token?.refreshToken as string | undefined
      const accessToken = token?.accessToken as string | undefined

      const nowUnix = (Date.now() / 1000) as number

      const decodedRefreshToken = decodeJWT(refreshToken)
      const decodedAccessToken = decodeJWT(accessToken)
      const refreshRemaingSeconds = Math.max(decodedRefreshToken?.payload?.exp || 0 - nowUnix, 0)
      const accessRemaingSeconds = Math.max(decodedAccessToken?.payload?.exp || 0 - nowUnix, 0)

      if (!refreshToken || refreshRemaingSeconds === 0)
        throw new AuthError('authentication token expired')
      if (refreshRemaingSeconds <= 60 || accessRemaingSeconds <= 60) {
        const updatedTokens = await refreshTokenFn(refreshToken)
        if (!updatedTokens) throw new AuthError('refresh token error')
        return { ...token, updatedTokens }
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session?.user,
          ...token,
        },
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 180,
    updateAge: 0,
  },
} satisfies NextAuthConfig
