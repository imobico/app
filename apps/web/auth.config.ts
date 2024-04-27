import type { Account, Profile, Session } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import type { SignInResponse } from '@/shared/types/api'
import { isValidToken, refreshTokenFn } from '@/shared/utils'
import axios from '@/shared/utils/axios'

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
      console.log('calling authorized')

      const isLoggedIn = !!auth?.user
      const isPrivatePath = nextUrl.pathname.startsWith('/app')
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
      console.log('calling jwt')

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
      if (!isValidToken(refreshToken, 0.5)) return null

      const accessToken = token?.accessToken as string
      if (!isValidToken(accessToken, 0.8)) {
        const updateTokenResp = await refreshTokenFn(refreshToken)
        if (!updateTokenResp || updateTokenResp.status !== 201) return null
        const updateTokens = await updateTokenResp.json()
        token.accessToken = updateTokens.access_token
        token.refreshToken = updateTokens.refresh_token
        return token
      }

      return token
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
