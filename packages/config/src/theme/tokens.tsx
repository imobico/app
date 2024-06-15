import { purple, purpleDark } from '@tamagui/colors'

export const colorTokens = {
  light: {
    purple: purple,
  },
  dark: {
    purple: purpleDark,
  },
}

export const darkColors = {
  ...colorTokens.dark.purple,
}

export const lightColors = {
  ...colorTokens.light.purple,
}
