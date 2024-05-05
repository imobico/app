import { SignInScreen } from '@imoblr/shared/features/sign-in/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Sign In',
        }}
      />
      <SignInScreen />
    </>
  )
}
