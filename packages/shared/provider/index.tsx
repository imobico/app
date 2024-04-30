import { CustomToast, type TamaguiProviderProps, ToastProvider } from '@imoblr/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastViewport } from './ToastViewport'

// Create a client
const queryClient = new QueryClient()

export function SharedProviders({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider
        swipeDirection='horizontal'
        duration={6000}
        native={
          [
            // uncomment to enable native toasts on mobile
            // 'mobile'
          ]
        }
      >
        {children}
        <CustomToast />
        <ToastViewport />
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
