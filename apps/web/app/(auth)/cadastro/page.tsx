'use client'

import { YStack } from '@imoblr/ui'
import { SignUpSignInComponent } from './SignUpSignIn'

const SignInScreen = (): React.ReactNode => {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <SignUpSignInComponent type='sign-in' />
    </YStack>
  )
}

export default SignInScreen
