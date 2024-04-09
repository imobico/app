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
  loaded: boolean
  state?: AuthPropsState
  onLogin: (email: string, password: string) => Promise<any>
  onLogout: () => Promise<any>
  onAccessTokenExpired: () => Promise<any>
  onRefreshTokenExpired: () => Promise<any>
}

export const AuthContext = createContext<AuthProps>({} as AuthProps)
export const useAuth = () => useContext(AuthContext)
