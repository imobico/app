import { useCurrentUser } from '@imoblr/shared/hooks/useCurrentUser'
import { getSession, signOut } from '@imoblr/shared/provider/session/index.native'
import { Button, Paragraph, YStack } from '@imoblr/ui'
import React from 'react'
import { View } from 'react-native'

const Screen = () => {
  const { data } = useCurrentUser()
  const session = getSession()

  return (
    <YStack f={1} jc='center' ai='center' p='$4' gap='$4'>
      <Paragraph>HomePage</Paragraph>
      <Button
        onPress={async () => {
          await signOut()
        }}
      >
        My button
      </Button>
    </YStack>
  )
}

export default Screen
