import { AxiosInstance } from '@/shared/lib/axios'
import { useSession } from '@/shared/provider/session'
import { useEffect } from 'react'

export const useAxios = () => {
  const { data: authState, update, signOut, status } = useSession()

  useEffect(() => {
    const requestIntercept = AxiosInstance.interceptors.request.use(
      async (config) => {
        const accessToken = authState?.user?.accessToken
        if (!config.headers.Authorization) {
          console.log('accesstoken', accessToken)
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
        if (error.response.status === 401) {
          prevRequest.sent = true
          const newTokens = await update({ ...authState, forceUpdate: true })
          if (!newTokens) return await signOut()
          prevRequest.headers.Authorization = `Bearer ${newTokens?.user?.accessToken}`
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

  return { axios: AxiosInstance, status }
}
