import { useQuery } from '@tanstack/react-query'

import type { User } from '@/types/user'
import { useAxios } from './useAxios'

let enabled = false

export const useCurrentUser = () => {
  const { axios, status: authStatus } = useAxios()

  if (authStatus && authStatus !== 'loading') enabled = true

  return useQuery({
    enabled: enabled,
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const { data: currentUserData, status } = await axios.get('/profile')
      if (status === 200) return currentUserData.data as User
      throw new Error('authorization failed')
    },
  })
}

export default useCurrentUser
