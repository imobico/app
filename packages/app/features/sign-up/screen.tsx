import { YStack } from '@t4/ui'
import { SignUpSignInComponent } from 'app/features/sign-in/SignUpSignIn'

export const SignUpScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent
        type='sign-up'
        handleOAuthWithPress={() => { }}
        handleEmailWithPress={() => { }}
      />
    </YStack>
  )
}
