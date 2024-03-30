import { YStack, useToastController } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'
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
