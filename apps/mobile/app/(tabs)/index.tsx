import type { CheckboxProps, SizeTokens } from '@imoblr/ui'
import { useThemeSetting } from '@tamagui/next-theme'

import {
  Checkbox,
  Heading,
  Label,
  Separator,
  Switch,
  Button as TamaguiButton,
  Text,
  Theme,
  XStack,
  YStack,
  useIsomorphicLayoutEffect,
} from '@imoblr/ui'
import { Button, Image, Platform, StyleSheet } from 'react-native'

import { HelloWave } from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useState } from 'react'

export function CheckboxWithLabel({
  size,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & { size: SizeTokens; label?: string }) {
  const id = `checkbox-${size.toString().slice(1)}`
  return (
    <XStack width={300} alignItems='center' space='$4'>
      <Checkbox id={id} size={size} {...checkboxProps}>
        <Checkbox.Indicator>
          <Text>X</Text>
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}

export function SwitchWithLabel(props: { size: SizeTokens; defaultChecked?: boolean }) {
  const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ''}}`
  return (
    <XStack width={200} alignItems='center' gap='$4'>
      <Label
        paddingRight='$0'
        minWidth={90}
        justifyContent='flex-end'
        size={props.size}
        htmlFor={id}
      >
        Accept
      </Label>
      <Separator minHeight={20} vertical />
      <Switch theme='light' id={id} size={props.size} defaultChecked={props.defaultChecked}>
        <Switch.Thumb animation='faster' />
      </Switch>
    </XStack>
  )
}

export default function HomeScreen() {
  const themeSetting = useThemeSetting()
  const [clientTheme, setClientTheme] = useState<string>('dark')

  useIsomorphicLayoutEffect(() => {
    setClientTheme(themeSetting.current || 'dark')
  }, [themeSetting.current, themeSetting.resolvedTheme])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Heading>Welcome!</Heading>
        <TamaguiButton onPress={themeSetting.toggle}>Change theme: {clientTheme}</TamaguiButton>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 1: Try it</ThemedText>
        <ThemedView style={styles.stepContainer}>
          <YStack width={200} alignItems='center' gap='$3'>
            <XStack gap='$3' $xs={{ flexDirection: 'column' }}>
              <YStack width={200} alignItems='center' gap='$3'>
                <Theme name='dark_purple'>
                  <XStack gap='$3' $xs={{ flexDirection: 'column' }}>
                    <SwitchWithLabel size='$2' />
                    <SwitchWithLabel size='$2' defaultChecked />
                  </XStack>
                </Theme>
                <Theme name='purple'>
                  <XStack gap='$3' $xs={{ flexDirection: 'column' }}>
                    <SwitchWithLabel size='$3' />
                    <SwitchWithLabel size='$3' defaultChecked />
                  </XStack>
                </Theme>
                <XStack gap='$3' $xs={{ flexDirection: 'column' }}>
                  <SwitchWithLabel size='$4' />
                  <SwitchWithLabel size='$4' defaultChecked />
                </XStack>
              </YStack>
            </XStack>
          </YStack>
          <YStack width={300} alignItems='center' space='$2'>
            <Theme name='purple'>
              <CheckboxWithLabel size='$3' />
            </Theme>
            <CheckboxWithLabel size='$4' defaultChecked />
            <CheckboxWithLabel size='$5' disabled label='Accept terms (disabled)' />
          </YStack>
          <TamaguiButton onPress={() => console.log('pressed')}>My tamagui button</TamaguiButton>
        </ThemedView>
        <ThemedText>
          Edit <ThemedText type='defaultSemiBold'>app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type='defaultSemiBold'>
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type='defaultSemiBold'>npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type='defaultSemiBold'>app</ThemedText> directory. This will move the current{' '}
          <ThemedText type='defaultSemiBold'>app</ThemedText> to{' '}
          <ThemedText type='defaultSemiBold'>app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
