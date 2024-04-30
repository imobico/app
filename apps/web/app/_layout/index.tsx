'use client'

import { SharedProviders } from '@imoblr/shared/provider'
import { type Session, SessionProvider } from '@imoblr/shared/provider/session'
import { TamaguiNextProvider } from './TamaguiNextProvider'

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | undefined
}) {
  return (
    <html lang='pt-BR'>
      <body>
        {/* this Tamagui provider is tailored to the web (NextJS) app */}
        <TamaguiNextProvider>
          <SessionProvider session={session}>
            <SharedProviders>{children}</SharedProviders>
          </SessionProvider>
        </TamaguiNextProvider>
      </body>
    </html>
  )
}
