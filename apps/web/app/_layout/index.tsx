import { Provider } from '@/shared/provider'
import type { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Provider>
      <html lang='en'>
        <body>{children}</body>
      </html>
    </Provider>
  )
}
