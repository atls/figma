export enum FontSize {
  Atomic = 'atomic',
  Micro = 'micro',
  Tiny = 'tiny',
  Small = 'small',
  Reduced = 'reduced',

  Normal = 'normal',
  Regular = 'regular',
  Extra = 'extra',

  Medium = 'medium',
  Increased = 'increased',

  Large = 'large',
  Huge = 'huge',
  Giant = 'giant',
}

export const FontSmallSizes = [
  FontSize.Atomic,
  FontSize.Micro,
  FontSize.Tiny,
  FontSize.Small,
  FontSize.Reduced,
]

export const FontNormalSizes = [
  FontSize.Normal,
  FontSize.Regular,
  FontSize.Extra,
]

export const FontMediumSizes = [FontSize.Medium, FontSize.Increased]

export const FontLargeSizes = [FontSize.Large, FontSize.Huge, FontSize.Giant]
