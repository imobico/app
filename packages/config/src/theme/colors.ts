// export {
//   blue,
//   blueDark,
//   gray,
//   grayDark,
//   green,
//   greenDark,
//   orange,
//   orangeDark,
//   pink,
//   pinkDark,
//   purple,
//   purpleDark,
//   red,
//   redDark,
//   yellow,
//   yellowDark,
// } from '@tamagui/colors'

import type { VariableVal } from '@tamagui/web'
import { createTokens } from 'tamagui'

export const dark = ['#000', '#111', '#222', '#999', '#ccc', '#eee', '#fff']
export const light = ['#fff', '#eee', '#ccc', '#999', '#222', '#111', '#000']

export const purple = [
  'hsl(50, 100%, 92.0%)', // background
  'hsl(50, 100%, 88.5%)',
  'hsl(50, 100%, 81.0%)',
  'hsl(50, 100%, 56.1%)',
  'hsl(50, 100%, 50.3%)',
  'hsl(50, 100%, 42.5%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 98.0%, 95.8%)', // foreground
]

export const dark_purple = [
  'hsl(50, 100%, 92.0%)', // background
  'hsl(50, 100%, 88.5%)',
  'hsl(50, 100%, 81.0%)',
  'hsl(50, 100%, 56.1%)',
  'hsl(50, 100%, 50.3%)',
  'hsl(50, 100%, 42.5%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 100%, 9.0%)',
  'hsl(50, 98.0%, 95.8%)', // foreground
]

export const colors = {
  light,
  dark,
  purple,
  dark_purple,
}

/*
 Maps all color palettes to individual color tokens
 to be used programmatically
*/

export const colorTokens = Object.fromEntries(
  Object.entries(colors).flatMap(([name, arr]) =>
    arr.map((value, index) => [
      `${name
        .replace(/_(\w)/g, (_, char) => char.toUpperCase())
        .replace(/^(.)/, (char) => char.toLowerCase())}${index + 1}`,
      value,
    ]),
  ),
) as { [key: string]: VariableVal }

export default colors
