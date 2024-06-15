import type { VariableVal } from '@tamagui/web'

export const slate = [
  '#FCFCFD',
  '#F9FAFB',
  '#F2F4F7',
  '#F2F4F7',
  '#EAECF0',
  '#D0D5DD',
  '#98A2B3',
  '#667085',
  '#475467',
  '#344054',
  '#182230',
  '#101828',
  '#0C111D',
  '#090D17',
  '#060A11',
]

export const slate_dark = [
  '#060A11',
  '#090D17',
  '#101828',
  '#182230',
  '#344054',
  '#475467',
  '#667085',
  '#98A2B3',
  '#D0D5DD',
  '#EAECF0',
  '#F2F4F7',
  '#F2F4F7',
  '#F9FAFB',
  '#FCFCFD',
]

export const purple = [
  '#FCFAFF', // background
  '#F9F5FF',
  '#F4EBFF',
  '#E9D7FE',
  '#D6BBFB',
  '#B692F6',
  '#9E77ED',
  '#7F56D9',
  '#6941C6',
  '#53389E',
  '#42307D',
  '#2C1C5F',
  '#170F34',
  '#0D0820',
]

export const purple_dark = [
  '#0D0820',
  '#170F34',
  '#2C1C5F', // background
  '#42307D',
  '#53389E',
  '#6941C6',
  '#7F56D9',
  '#9E77ED',
  '#B692F6',
  '#D6BBFB',
  '#E9D7FE',
  '#F4EBFF',
  '#F9F5FF',
  '#FCFAFF', // foreground
]

export const colors = {
  slate,
  slate_dark,
  purple,
  purple_dark,
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

export default colorTokens
