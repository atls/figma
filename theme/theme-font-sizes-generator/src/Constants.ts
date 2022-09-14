// eslint-disable-next-line no-shadow
export enum Group {
  SMALL = 'small',
  NORMAL = 'normal',
  MEDIUM = 'medium',
  LARGE = 'large',
}

// eslint-disable-next-line no-shadow
export enum FontSize {
  SemiTiny = 'semiTiny',
  Tiny = 'tiny',
  SemiSmall = 'semiSmall',
  Small = 'small',
  SemiReduced = 'semiReduced',
  Reduced = 'reduced',
  SemiDefault = 'semiDefault',

  Default = 'default',

  SemiIncreased = 'semiIncreased',
  Increased = 'increased',
  SemiLarge = 'semiLarge',
  Large = 'large',
  SemiHuge = 'semiHuge',
  Huge = 'huge',
  SemiGiant = 'semiGiant',
  Giant = 'giant',
}

export const FontSizeNames = [FontSize.Default]

export const groupNamesLessThanDefault = [
  FontSize.SemiTiny,
  FontSize.Tiny,
  FontSize.SemiSmall,
  FontSize.Small,
  FontSize.SemiReduced,
  FontSize.Reduced,
  FontSize.SemiDefault,
]

export const groupNamesGreaterThanDefault = [
  FontSize.SemiIncreased,
  FontSize.Increased,
  FontSize.SemiLarge,
  FontSize.Large,
  FontSize.SemiHuge,
  FontSize.Huge,
  FontSize.SemiGiant,
  FontSize.Giant,
]
