'use client'

import { SharedProviders } from '@imoblr/shared/provider'
import { type Session, SessionProvider } from '@imoblr/shared/provider/session'
import { TamaguiNextProvider } from './TamaguiNextProvider'

const refetchInterval = Number.parseInt(process.env.AUTH_SESSION_REFRESH_INTERVAL || '60', 10)

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | undefined
}) {
  console.log('RootLayout session', { session })

  return (
    <html lang='pt-BR'>
      <body>
        {/* this Tamagui provider is tailored to the web (NextJS) app */}
        <TamaguiNextProvider>
          <SessionProvider refetchInterval={refetchInterval} session={session}>
            <SharedProviders>{children}</SharedProviders>
          </SessionProvider>
        </TamaguiNextProvider>
      </body>
    </html>
  )
}
