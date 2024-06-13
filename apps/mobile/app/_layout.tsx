import { tamaguiConfig } from '@imoblr/config'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { TamaguiProvider, Theme } from '@tamagui/core'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { useColorScheme } from '@/hooks/useColorScheme'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    EudoxusSans: require('../assets/fonts/Eudoxus-Sans/Variable/EudoxusSansGX.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      // defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      defaultTheme='dark'
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Theme name='purple'>
          <Stack>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='+not-found' />
          </Stack>
        </Theme>
      </ThemeProvider>
    </TamaguiProvider>
  )
}
