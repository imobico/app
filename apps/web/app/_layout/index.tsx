'use client'

import { SharedProviders } from '@imoblr/shared/provider'
import { type Session, SessionProvider } from '@imoblr/shared/provider/session'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TamaguiNextProvider } from './TamaguiNextProvider'

const refetchInterval = Number.parseInt(process.env.AUTH_SESSION_REFRESH_INTERVAL || '60', 10)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  session: Session | undefined
}) {
  return (
    <html lang='pt-BR'>
      <body>
        {/* this Tamagui provider is tailored to the web (NextJS) app */}
        <TamaguiNextProvider>
          <SessionProvider refetchInterval={refetchInterval}>
            <SharedProviders>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </SharedProviders>
          </SessionProvider>
        </TamaguiNextProvider>
      </body>
    </html>
  )
}
