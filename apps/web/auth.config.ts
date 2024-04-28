import { type Account, AuthError, type Profile, type Session } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { SignInResponse } from '@/shared/types/api'
import { decodeJWT, getTokenDurationInSecs, isValidToken, refreshTokenFn } from '@/shared/utils'
import axios from '@/shared/utils/axios'

type CheckTokenResponse = 'unauthorized' | 'update' | 'valid'

const checkTokens = (refreshToken: string | undefined, accessToken: string | undefined): CheckTokenResponse => {
  if (!refreshToken) return 'unauthorized'
  const refreshTokenDuration = getTokenDurationInSecs(refreshToken)
  const accessTokenDuration = getTokenDurationInSecs(accessToken)
  if (refreshTokenDuration <= 0) return 'unauthorized'
  if (refreshTokenDuration <= 180 || accessTokenDuration <= 120) return 'update'
  return 'valid'
}

const updateTokens = async (refreshToken: string) => {
  if (!refreshToken) return
  const updateTokenResp = await refreshTokenFn(refreshToken)
  if (!updateTokenResp || updateTokenResp.status !== 201) throw new AuthError('Session update error')
  const updateTokens = await updateTokenResp.json()
  return {
    accessToken: updateTokens.access_token,
    refreshToken: updateTokens.refresh_token
  }
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
      const isPrivatePath = nextUrl.pathname.startsWith('/app') || nextUrl.pathname.startsWith('/dashboard')
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
      if (trigger === 'update' && session.user) {
        return { ...token, ...session.user }
      }

      if (user && account) {
        token = user.data?.user
        token.accessToken = user.access_token
        token.refreshToken = user.refresh_token
        return token
      }

      const refreshToken = token?.refreshToken as string
      if (refreshToken) {
        const decodedRefreshToken = decodeJWT(refreshToken)
        if (!decodedRefreshToken) throw new AuthError('Invalid refresh token')
        const refreshExpiresAt = decodedRefreshToken.payload.exp
        const refreshIssuedAt = decodedRefreshToken.payload.iat
        const totalSessionTime = refreshExpiresAt - refreshIssuedAt
        const nowUnix = (Date.now() / 1000) as number
        const elapsedTime = nowUnix - refreshIssuedAt
        const sessionLimit = totalSessionTime * 0.5
        if (elapsedTime >= sessionLimit) {
          const updatedTokens = await refreshTokenFn(refreshToken)
          return { ...token, updatedTokens }
        }
      }

      return token

      // console.log('calling jwt')

      // if (trigger === 'signIn' && user && account) {
      //   token = user?.data?.user
      //   token.accessToken = user?.access_token
      //   token.refreshToken = user?.refresh_token
      //   return token
      // }

      // const refreshToken = session?.user?.refreshToken || token?.refreshToken
      // const accessToken = session?.user?.accessToken || token?.accessToken
      // const checkTokenResp = checkTokens(refreshToken, accessToken)

      // if (checkTokenResp === 'unauthorized') throw new AuthError('Invalid session')
      // if (trigger === 'update' && session?.user || checkTokenResp === 'update') {
      //   const newTokens = await updateTokens(refreshToken)
      //   return {
      //     ...token,
      //     ...session?.user,
      //     ...newTokens
      //   }
      // }

      // return token
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      console.log('calling session')

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
