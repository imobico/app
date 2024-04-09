import { useAuth } from '@/shared/context/auth'
import { Provider } from '@/shared/provider'
import { Paragraph } from '@/ui/src'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, Tabs } from 'expo-router'
import { useEffect } from 'react'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const { state: authState, loaded: authLoaded } = useAuth()
  const hasValidAuth = !!(authLoaded && !!authState?.refreshToken)

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
    <Provider>
      {hasValidAuth ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(authenticated)' />
        </Stack>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(public)' />
        </Stack>
      )}
    </Provider>
  )
}
