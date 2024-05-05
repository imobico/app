import { type Account, AuthError, type Profile, type Session } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { SignInResponse } from '@imoblr/shared/types/api'
import { decodeJWT, refreshTokenFn } from '@imoblr/shared/utils/jwt'
import { now } from '@imoblr/shared/utils/time'

const REFRESH_TOKEN_MIN_DURATION = Number.parseInt(
  process.env.AUTH_REFRESH_TOKEN_MIN_DURATION_IN_SECS || '86400',
  10,
)
const ACCESS_TOKEN_MIN_DURATION = Number.parseInt(
  process.env.AUTH_ACCESS_TOKEN_MIN_DURATION_IN_SECS || '300',
  10,
)

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
      const publicPaths = ['/sign-in', '/sign-up']
      const isLoggedIn = !!auth?.user
      const isPublicPath = publicPaths.some((path) => nextUrl.pathname.startsWith(path))
      if (isPublicPath) return true
      return isLoggedIn
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

      const nowUnix = now()
      const decodedRefreshToken = decodeJWT(refreshToken)
      const decodedAccessToken = decodeJWT(accessToken)
      const refreshRemaingSeconds = Math.max((decodedRefreshToken?.payload?.exp || 0) - nowUnix, 0)
      const accessRemaingSeconds = Math.max((decodedAccessToken?.payload?.exp || 0) - nowUnix, 0)

      if (!refreshToken || refreshRemaingSeconds === 0)
        throw new AuthError('authentication token expired')

      if (
        refreshRemaingSeconds <= REFRESH_TOKEN_MIN_DURATION ||
        accessRemaingSeconds <= ACCESS_TOKEN_MIN_DURATION
      ) {
        const updatedTokens = await refreshTokenFn(refreshToken)
        if (!updatedTokens) throw new AuthError('refresh token error')
        return { ...token, ...updatedTokens }
      }

      return { ...token, ...user }
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
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig
