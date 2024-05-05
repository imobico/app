import { SignUpSignInComponent } from '@imoblr/shared/features/sign-in/SignUpSignIn'
import { YStack } from '@imoblr/ui'

export const SignUpScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent type='sign-up' />
    </YStack>
  )
}
