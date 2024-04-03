import { SignUpSignInComponent } from '@/shared/features/sign-in/SignUpSignIn'
import { YStack } from '@imoblr/ui'

export const SignInScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent />
    </YStack>
  )
}
