'use client'

import { Provider } from '@/shared/provider'
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'
import { StyleSheet } from 'react-native'
import Tamagui from '../tamagui.config'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // @ts-ignore
  const rnwStyle = StyleSheet.getSheet()

  return (
    <html lang='en'>
      <style dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} id={rnwStyle.id} />
      <style
        key='tamagui-css'
        dangerouslySetInnerHTML={{
          __html: Tamagui.getCSS({
            exclude: process.env.NODE_ENV === 'development' ? null : 'design-system',
          }),
        }}
      />
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
