import { useCurrentUser } from '@imoblr/shared/hooks/useCurrentUser'
import { signOut } from '@imoblr/shared/provider/session'
import { Button, Paragraph, YStack } from '@imoblr/ui'
import React from 'react'

const Screen = () => {
  const { data } = useCurrentUser()

  return (
    <YStack f={1} jc='center' ai='center' p='$4' gap='$4'>
      <Paragraph>HomePage</Paragraph>
      <Paragraph>{JSON.stringify(data)}</Paragraph>
      <Button
        onPress={async () => {
          await signOut({ callbackUrl: '/entrar' })
        }}
      >
        SignOut
      </Button>
    </YStack>
  )
}

export default Screen
