import { type Account, AuthError, type Profile, type Session } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { SignInResponse } from '@/shared/types/api'
import { decodeJWT, getTokenDurationInSecs, isValidToken, refreshTokenFn } from '@/shared/utils'
import axios from '@/shared/utils/axios'

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
        try {
          const res = await axios.post('/signin', {
            email: credentials?.email,
            password: credentials?.password,
          })

          const auth = res.data
          if (res.status === 201 && auth) return auth
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

      if (trigger === 'signIn' && user && account) {
        token = user.data?.user
        token.accessToken = user.access_token
        token.refreshToken = user.refresh_token
        return token
      }

      const refreshToken = token?.refreshToken as string | undefined
      const accessToken = token?.accessToken as string | undefined

      if (!refreshToken) throw new AuthError('invalid authentication token')

      const decodedRefreshToken = decodeJWT(refreshToken)
      if (!decodedRefreshToken) throw new AuthError('invalid authentication token')

      const refreshExpiresAt = decodedRefreshToken.payload.exp
      if (!refreshExpiresAt) throw new AuthError('invalid authentication token')

      const nowUnix = (Date.now() / 1000) as number
      const remaingSeconds = Math.max(refreshExpiresAt - nowUnix, 0)
      if (remaingSeconds === 0) throw new AuthError('authentication token expired')
      if (remaingSeconds <= 60) {
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
