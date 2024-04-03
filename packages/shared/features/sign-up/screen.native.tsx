import { SignUpSignInComponent } from '@/shared/features/sign-in/SignUpSignIn'
import { YStack, useToastController } from '@imoblr/ui'
import { capitalizeWord } from '@imoblr/ui/src/libs/string'
import { getInitialURL } from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'
import { useRouter } from 'solito/router'

export const SignUpScreen = (): React.ReactNode => {
  const { replace } = useRouter()
  const toast = useToastController()

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent />
    </YStack>
  )
}
