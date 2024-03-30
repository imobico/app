import { YStack } from '@imoblr/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'

export const SignInScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent />
    </YStack>
  )
}
