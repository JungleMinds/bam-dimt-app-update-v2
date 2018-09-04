// @flow

export const colors = {
  blue: '#56C9F3',
  blueMedium: '#1FABDE',
  blueDark: '#126685',
  blueLight: '#D5F2FC',
  orange: '#FE9D32',
  orangeMedium: '#FF6600',
  orangeDark: '#EB5E00',
  orangeTranslucent: 'rgba(254, 157, 50, 0.85)',
  greenLight: '#DCEFD0',
  green: '#72C045',
  greenMedium: '#0DB02B',
  greenDark: '#076919',
  greenTranslucent: 'rgba(114, 192, 69, 0.85)',
  navyLight: '#D7DDE8',
  navy: '#5D77A3',
  navyMedium: '#455C85',
  navyDark: '#29374F',
  navyTranslucent: 'rgba(93, 119, 163, 0.85)',
  pinkLight: '#FFDCE0',
  pink: '#FF7485',
  pinkMedium: '#E65063',
  pinkDark: '#BC3048',
  pinkTranslucent: 'rgba(255, 116, 133, 0.85)',
  redLight: '#EEC7D0',
  red: '#B91A41',
  redMedium: '#9A0F31',
  redDark: '#770823',
  redTranslucent: 'rgba(185, 26, 65, 0.85)',
  purpleLight: '#EFE9F9',
  purple: '#9C73DA',
  purpleMedium: '#7245B8',
  purpleDark: '#573986',
  purpleTranslucent: 'rgba(156, 115, 218, 0.85)',
  grey: '#BCAD9F',
  greyLight: '#E6E3E0',
  greyDark: '#8D8378',
  marine: '#74C4CB',
  marineLight: '#E1EBEB',
  marineMedium: '#34ABB5',
  marineDark: '#20838C',
  marineTranslucent: 'rgba(116, 196, 203, 0.85)',
  beige: '#BCAD9F',
  beigeMedium: '#8D8378',
  bodyText: '#544E48',
  headerText: '#696259',
  error: '#D0021B'
}

export type Theme = {
  color: string,
  colorMedium: string,
  colorDark: string,
  translucentColor: string
}

export const generalTheme = {
  color: colors.orange,
  colorMedium: colors.orangeMedium,
  colorDark: colors.orangeDark,
  translucentColor: colors.orangeTranslucent
}

export const kitchenTheme = {
  color: colors.green,
  colorMedium: colors.greenMedium,
  colorDark: colors.greenDark,
  colorLight: colors.greenLight,
  translucentColor: colors.greenTranslucent
}

export const bathroomTheme = {
  color: colors.navy,
  colorMedium: colors.navyMedium,
  colorDark: colors.navyDark,
  colorLight: colors.navyLight,
  translucentColor: colors.navyTranslucent
}

export const doorsTheme = {
  color: colors.pink,
  colorMedium: colors.pinkMedium,
  colorDark: colors.pinkDark,
  colorLight: colors.pinkLight,
  translucentColor: colors.pinkTranslucent
}

export const othersTheme = {
  color: colors.red,
  colorMedium: colors.redMedium,
  colorDark: colors.redDark,
  colorLight: colors.redLight,
  translucentColor: colors.redTranslucent
}

export const gardensTheme = {
  color: colors.marine,
  colorMedium: colors.marineMedium,
  colorDark: colors.marineDark,
  colorLight: colors.marineLight,
  translucentColor: colors.marineTranslucent
}

export const floorsAndWallsTheme = {
  color: colors.purple,
  colorMedium: colors.purpleMedium,
  colorDark: colors.purpleDark,
  colorLight: colors.purpleLight,
  translucentColor: colors.purpleTranslucent
}
