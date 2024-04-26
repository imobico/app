import { createContext, useContext } from 'react'

export interface AuthPropsState {
  refreshToken?: string | null
  accessToken?: string | null
}

export interface SecureStoreData extends AuthPropsState {
  email: string
  password: string
}

export interface AuthProps {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  data?: AuthPropsState
  signIn: (email: string, password: string) => Promise<any>
  signOut: (deleteOnServer?: boolean) => Promise<any>
  update: () => Promise<any>
}

export const SessionContext = createContext<AuthProps>({} as AuthProps)
export const useSession = () => useContext(SessionContext)
