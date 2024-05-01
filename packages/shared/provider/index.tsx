import { CustomToast, ToastProvider } from '@imoblr/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
    </QueryClientProvider>
  )
}
