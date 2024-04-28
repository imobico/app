import { UserDetailScreen } from '@imoblr/shared/features/user/detail-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'User',
        }}
      />
      <UserDetailScreen />
    </>
  )
}
