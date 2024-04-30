'use client'

import { SharedProviders } from '@imoblr/shared/provider'
import { TamaguiNextProvider } from './TamaguiNextProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>
        {/* this Tamagui provider is tailored to the web (NextJS) app */}
        <TamaguiNextProvider>
          <SharedProviders>{children}</SharedProviders>
        </TamaguiNextProvider>
      </body>
    </html>
  )
}
