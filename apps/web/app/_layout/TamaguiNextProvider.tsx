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
              // if you are using "outputCSS" option, you should use this "exclude"
              // if not, then you can leave the option out
              // exclude:
              //   process.env.NODE_ENV === "production" ? "design-system" : null,
            }),
          }}
        />
      </>
    )
  })

  return (
    // <NextThemeProvider
    //   skipNextHead
    //   onChangeTheme={(next) => {
    //     setTheme(next as any);
    //   }}
    // >
    <TamaguiProvider
      config={tamaguiConfig}
      // themeClassNameOnRoot
      defaultTheme={(scheme || theme) === 'light' ? 'light' : 'dark'}
    >
      {children}
    </TamaguiProvider>
    // </NextThemeProvider>
  )
}
