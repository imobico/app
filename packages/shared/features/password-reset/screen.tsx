import { YStack } from '@imoblr/ui'
import { PasswordResetComponent } from '@imoblr/ui/src/PasswordReset'
import { useRouter } from 'solito/router'

export function PasswordResetScreen() {
  const { push } = useRouter()

  const handleEmailWithPress = async () => {
    // Send email with the password reset link

    push('/')
  }

  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='email' handleWithPress={handleEmailWithPress} />
    </YStack>
  )
}