import { SignUpSignInComponent } from '@/shared/features/sign-in/SignUpSignIn'
import { YStack, useToastController } from '@imoblr/ui'
import { useRouter } from 'solito/router'

export const SignInScreen = (): React.ReactNode => {
  const { replace } = useRouter()
  const toast = useToastController()

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent />
    </YStack>
  )
}
