import { AxiosInstance } from '@imoblr/shared/lib/axios'
import { signOut, useSession } from '@imoblr/shared/provider/session'
import { useEffect } from 'react'

export const useAxios = () => {
  const { data: authState, update, status } = useSession()

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
        if (error.response.status === 403) return await signOut({ callbackUrl: '/entrar' })
        if (error.response.status === 401) {
          prevRequest.sent = true
          const newTokens = await update({ ...authState, forceUpdate: true })
          if (!newTokens) return await signOut({ callbackUrl: '/entrar' })
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
  }, [authState, update])

  return { axios: AxiosInstance, status }
}
