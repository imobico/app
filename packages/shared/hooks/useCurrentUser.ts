import { useQuery } from '@tanstack/react-query'

import type { User } from '@/types/user'
import { useAxios } from './useAxios'

export const useCurrentUser = () => {
  const { axios } = useAxios()

  return useQuery({
    enabled: true,
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const { data: currentUserData } = await axios.get('/profile')
      return currentUserData.data as User
    },
  })
}

export default useCurrentUser
