'use client'

import { View } from 'tamagui'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <View flex={1} backgroundColor='$purple14'>
      {children}
    </View>
  )
}
