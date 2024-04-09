import { useAxios } from '@/shared/hooks/useAxios'
import { Paragraph, View } from '@imoblr/ui'
import { useEffect, useState } from 'react'

interface ProfileData {

}

export const DashboardScreen = (): React.ReactNode => {
  const { axios } = useAxios()
  const [state, setState] = useState({} as ProfileData)

  useEffect(() => {
    const req = axios.get('/profile').then((resp) => {
      if (resp.status === 200) {
        setState(resp.data)
      }
    }).catch(console.error)
    Promise.resolve(req)
  }, [axios])

  return (
    <View flex={1} justifyContent='center' alignItems='center' space>
      <Paragraph size='$3' opacity={0.5}>
        Logged
      </Paragraph>
      <Paragraph>
        {JSON.stringify(state)}
      </Paragraph>
    </View>
  )
}
