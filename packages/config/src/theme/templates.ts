const template = {
  background: 1,
  backgroundHover: 3,
  backgroundPress: 4,
  backgroundFocus: 5,
  backgroundStrong: 1,
  backgroundTransparent: 0,
  color: -1,
  colorHover: -2,
  colorPress: -1,
  colorFocus: -2,
  colorTransparent: -0,
  borderColor: 5,
  borderColorHover: 8,
  borderColorFocus: 4,
  borderColorPress: 5,
  placeholderColor: -4,
}

export const templates = {
  baseDark: template,
  baseLight: {
    ...template,
    // light color themes are a bit less sensitive
    borderColor: 4,
    borderColorHover: 5,
    borderColorFocus: 4,
    borderColorPress: 4,
  },
}
