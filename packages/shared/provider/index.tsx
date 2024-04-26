import { CustomToast, ToastProvider } from '@imoblr/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SafeAreaProvider } from './safe-area'
import { SolitoImageProvider } from './solito-image'
import { TamaguiProvider } from './tamagui'
import { TamaguiThemeProvider } from './theme'
import { ToastViewport } from './toast-viewport'

const queryClient = new QueryClient()

export function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}
