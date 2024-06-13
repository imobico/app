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
  '#f7f6fc', // background
  '#f0eef9',
  '#e3dff5',
  '#ccc5ed',
  '#b2a3e2',
  '#967dd5',
  '#8461c6',
  '#7854b5',
  '#604196',
  '#51377b',
  '#322253',
  '#322253', // foreground
]

export const dark_purple = [
  '#322253', // background
  '#51377b',
  '#604196',
  '#7854b5',
  '#8461c6',
  '#967dd5',
  '#b2a3e2',
  '#ccc5ed',
  '#e3dff5',
  '#f0eef9',
  '#f7f6fc', // foreground
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
