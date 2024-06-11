import { createSoftenMask, createThemeBuilder } from '@tamagui/theme-builder'
import colors from './colors'
import { shadows } from './shadows'
import { templates } from './templates'
import { darkColors, lightColors } from './tokens'

const colorThemeDefinition = (colorName: string) => [
  {
    parent: 'light',
    palette: colorName,
    template: 'colorLight',
  },
  {
    parent: 'dark',
    palette: colorName,
    template: 'base',
  },
]

const switchThumbTheme = [
  {
    parent: 'active',
    template: 'inverseActive',
  },
  {
    parent: '',
    template: 'switchThumb',
  },
]

const themesBuilder = createThemeBuilder()
  .addPalettes(colors)
  .addTemplates({
    ...templates,
    switchThumb: {
      background: 0,
      backgroundHover: 2,
      backgroundPress: 2,
      backgroundFocus: 4,
      borderColor: 3,
      borderColorHover: 6,
      borderColorPress: 2,
      borderColorFocus: 4,
      outlineColor: 4,
      color: 4,
      colorHover: 3,
      colorPress: 4,
      colorTransparent: 1,
      placeholderColor: 2,
      shadowColor: 3,
    },
  })
  .addMasks({
    soften: createSoftenMask(),
  })
  .addThemes({
    light: {
      template: 'base',
      palette: 'light',
      nonInheritedValues: {
        ...lightColors,
        ...shadows.light,
      },
    },
    dark: {
      template: 'base',
      palette: 'dark',
      nonInheritedValues: {
        ...darkColors,
        ...shadows.dark,
      },
    },
  })
  .addChildThemes({
    purple: colorThemeDefinition('purple'),
  })
  .addComponentThemes({
    SwitchThumb: switchThumbTheme,
  })

export const themes = themesBuilder.build()

export default themes
