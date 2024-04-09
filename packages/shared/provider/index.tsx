import { CustomToast, ToastProvider } from '@imoblr/ui'
import { AuthProvider } from './auth'
import { SafeAreaProvider } from './safe-area'
import { SolitoImageProvider } from './solito-image'
import { TamaguiProvider } from './tamagui'
import { TamaguiThemeProvider } from './theme'
import { ToastViewport } from './toast-viewport'

export function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <TamaguiThemeProvider>
        <TamaguiProvider>
          <SafeAreaProvider>
            <SolitoImageProvider>
              <ToastProvider swipeDirection='horizontal' duration={6000} native={['mobile']}>
                {children}
                <CustomToast />
                <ToastViewport />
              </ToastProvider>
            </SolitoImageProvider>
          </SafeAreaProvider>
        </TamaguiProvider>
      </TamaguiThemeProvider>
    </AuthProvider>
  )
}
