'use client'

import { View } from 'tamagui'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <View flex={1} bg='$purple8'>
      {children}
    </View>
  )
}
