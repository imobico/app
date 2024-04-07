import {
  Anchor,
  Button,
  H1,
  H3,
  Paragraph,
  ScrollView,
  Separator,
  Sheet,
  XStack,
  YStack,
  useToastController,
} from '@imoblr/ui'
import { ThemeToggle } from '@imoblr/ui/src/ThemeToggle'
import { ChevronDown } from '@tamagui/lucide-icons'
import React, { useState } from 'react'
import { Linking } from 'react-native'
import { SolitoImage } from 'solito/image'
import { useLink } from 'solito/navigation'

import { useSheetOpen } from '../../atoms/sheet'

export function HomeScreen() {
  const toast = useToastController()

  const signInLink = useLink({ href: '/sign-in' })

  const signUpLink = useLink({
    href: '/sign-up',
  })

  const paramsLink = useLink({
    href: '/params/tim',
  })

  return (
    <ScrollView>
      <YStack flex={1} jc='center' ai='center' p='$4' space='$4' backgroundColor='red'>
        <SolitoImage src='/t4-logo.png' width={128} height={128} alt='T4 Logo' />
        <H1 textAlign='center'>👋 Hello, T4 App</H1>
        <Separator />
        <Paragraph textAlign='center' size={'$2'}>
          Unifying React Native + Web. hehehe
        </Paragraph>
        <Paragraph textAlign='center' size={'$2'}>
          The T4 Stack is made by{' '}
          <Anchor href='https://twitter.com/ogtimothymiller' target='_blank'>
            Tim Miller
          </Anchor>
          , give it a star{' '}
          <Anchor href='https://github.com/timothymiller/t4-app' target='_blank' rel='noreferrer'>
            on Github.
          </Anchor>
        </Paragraph>
        <Paragraph textAlign='center' size={'$2'}>
          Tamagui is made by{' '}
          <Anchor href='https://twitter.com/natebirdman' target='_blank'>
            Nate Weinert
          </Anchor>
          , give it a star{' '}
          <Anchor href='https://github.com/tamagui/tamagui' target='_blank' rel='noreferrer'>
            on Github.
          </Anchor>
        </Paragraph>

        <XStack gap='$5'>
          <Button onPress={() => Linking.openURL('https://t4stack.com/')}>Learn More...</Button>
          <ThemeToggle />
        </XStack>

        <H3>🦮🐴 App Demos</H3>
        <YStack space='$2'>
          <Button {...paramsLink} space='$2'>
            Params
          </Button>
          <Button
            onPress={() => {
              toast.show('Hello world!', {
                message: 'Description here',
              })
            }}
          >
            Show Toast
          </Button>
          <SheetDemo />
        </YStack>

        <XStack space='$2'>
          <Button {...signInLink} space='$2'>
            Sign In
          </Button>
          <Button {...signUpLink} space='$2'>
            Sign Up
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  )
}

const SheetDemo = (): React.ReactNode => {
  const [open, setOpen] = useSheetOpen()
  const [position, setPosition] = useState(0)

  return (
    <>
      <Button onPress={() => setOpen((x) => !x)} space='$2'>
        Bottom Sheet
      </Button>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame alignItems='center' justifyContent='center'>
          <Sheet.Handle />
          <Button
            size='$6'
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
