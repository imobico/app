import { SignUpSignInComponent } from '@/shared/features/sign-in/SignUpSignIn'
import { YStack } from '@imoblr/ui'

export const SignUpScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent
        type='sign-up'
        handleOAuthWithPress={() => {}}
        handleEmailWithPress={() => {}}
      />
    </YStack>
  )
}