import { SharedProviders } from '@imoblr/shared/provider'
import { SessionProvider } from '@imoblr/shared/provider/session'
import { TamaguiProvider, config } from '@imoblr/ui'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout({ children }) {
  const [loaded, error] = useFonts({})
  const scheme = useColorScheme()

  useEffect(() => {
    if (error) throw error
  }, [error])

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
      config={config}
      disableInjectCSS
      defaultTheme={scheme === 'dark' ? 'dark' : 'light'}
    >
      <SessionProvider>
        <SharedProviders>
          <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot initialRouteName='/' />
          </ThemeProvider>
        </SharedProviders>
      </SessionProvider>
    </TamaguiProvider>
  )
}
