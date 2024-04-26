import { SignUpSignInComponent } from '@/shared/features/sign-in/SignUpSignIn'
import { YStack, useToastController } from '@imoblr/ui'

export const SignInScreen = (): React.ReactNode => {
  const toast = useToastController()

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent type='sign-in' />
    </YStack>
  )
}
