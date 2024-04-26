import NextAuth from 'next-auth'

import nextConfig from './auth.config'

export const { handlers, signIn, signOut, auth } = NextAuth(nextConfig)
