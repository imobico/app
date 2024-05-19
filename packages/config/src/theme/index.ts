import { createSoftenMask, createThemeBuilder } from '@tamagui/theme-builder'
import colors from './colors'

const themesBuilder = createThemeBuilder()
  .addPalettes(colors)
  .addTemplates({
    base: {
      background: 0,
      backgroundFocus: 0,
      backgroundHover: 0,
      backgroundPress: 0,
      borderColor: 0,
      borderColorFocus: 0,
      borderColorHover: 0,
      borderColorPress: 0,
      color: 0,
      colorFocus: 0,
      colorHover: 0,
      colorPress: 0,
      colorTransparent: 0,
      placeholderColor: 0,
      shadowColor: 0,
      shadowColorFocus: 0,
      shadowColorHover: 0,
      shadowColorPress: 0,
    },
  })
  .addMasks({
    soften: createSoftenMask(),
  })
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
    },
    dark: {
      template: 'base',
      palette: 'dark',
    },
    primary: {
      template: 'base',
      palette: 'blue',
    },
  })
  .addChildThemes({
    subtle: {
      mask: 'soften',
    },
  })

export const themes = themesBuilder.build()

export default themes
