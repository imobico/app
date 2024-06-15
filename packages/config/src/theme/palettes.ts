import { colors } from './colors'

const primaryColorGrayScheme = {
  purple: 'slate',
  purple_dark: 'slate_dark',
}

const buildPaletteForColor = (color: string) => {
  return {
    ...colors[primaryColorGrayScheme[color]],
    ...colors[color],
  }
}

export const palettes = {
  light: buildPaletteForColor('purple'),
  dark: buildPaletteForColor('purple_dark'),
  purple: buildPaletteForColor('purple'),
  purple_dark: buildPaletteForColor('purple_dark'),
}
