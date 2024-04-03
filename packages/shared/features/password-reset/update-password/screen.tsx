import { YStack } from '@imoblr/ui'
import { PasswordResetComponent } from '@imoblr/ui/src/PasswordReset'

export function UpdatePasswordScreen() {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='password' handleWithPress={() => {}} />
    </YStack>
  )
}
