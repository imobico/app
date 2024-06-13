'use client'

import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'
import { tamaguiConfig } from '@imoblr/config'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { useServerInsertedHTML } from 'next/navigation'
import type { ReactNode } from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'

export const TamaguiNextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useRootTheme()
  const scheme = useColorScheme()

  useServerInsertedHTML(() => {
    // @ts-ignore
    const rnwStyle = StyleSheet.getSheet()
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} id={rnwStyle.id} />
        <style
          dangerouslySetInnerHTML={{
            __html: tamaguiConfig.getCSS({
              exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
            }),
          }}
        />
      </>
    )
  })

  return (
    <NextThemeProvider
      skipNextHead
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        themeClassNameOnRoot
        // defaultTheme={(scheme || theme) === "light" ? "light" : "dark"}
        defaultTheme='light'
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  )
}
