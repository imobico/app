import { AxiosInstance } from '@/shared/lib/axios'
import { useEffect } from 'react'
import { useSession } from '../context/auth'

export const useAxios = () => {
  const { data: authState, update, signOut } = useSession()

  useEffect(() => {
    const requestIntercept = AxiosInstance.interceptors.request.use(
      async (config) => {
        const accessToken = authState?.accessToken
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    const responseIntercept = AxiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config
        if (error.response.status === 403) return await signOut()
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true
          const newTokens = await update()
          console.log('responseIntercept', { newTokens })
          prevRequest.headers.Authorization = `Bearer ${newTokens?.accessToken}`
          return AxiosInstance(prevRequest)
        }
        return Promise.reject(error)
      },
    )

    return () => {
      AxiosInstance.interceptors.request.eject(requestIntercept)
      AxiosInstance.interceptors.response.eject(responseIntercept)
    }
  }, [authState, signOut, update])

  return { axios: AxiosInstance }
}
