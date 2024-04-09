import { ParamsScreen } from '@/shared/features/params/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Params',
        }}
      />
      <ParamsScreen />
    </>
  )
}
