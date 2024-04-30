import type { User } from 'next-auth'

export interface SignInResponse extends User {
  user: {
    id: string
    name: string
    email: string
    inserted_at: string
    surname: string
    updated_at: string
  }
  access_token: string
  refresh_token: string
}
