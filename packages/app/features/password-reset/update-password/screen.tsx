import { YStack } from '@t4/ui'
import { PasswordResetComponent } from '@t4/ui/src/PasswordReset'

export function UpdatePasswordScreen() {
  return (
    <YStack flex={1} justifyContent='center' alignItems='center' space>
      <PasswordResetComponent type='password' handleWithPress={() => { }} />
    </YStack>
  )
}
