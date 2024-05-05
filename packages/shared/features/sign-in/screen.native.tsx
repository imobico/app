import { SignUpSignInComponent } from '@imoblr/shared/features/sign-in/SignUpSignIn'
import { YStack } from '@imoblr/ui'

export const SignInScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center'>
      <SignUpSignInComponent type='sign-in' />
    </YStack>
  )
}
