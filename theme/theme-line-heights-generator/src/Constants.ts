export enum Group {
  SMALL = 'small',
  NORMAL = 'normal',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum LineHeightSize {
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

export const LineHeightSizeDefaultName = LineHeightSize.Default

export const groupNamesLessThanDefault: Array<string> = [
  LineHeightSize.SemiTiny,
  LineHeightSize.Tiny,
  LineHeightSize.SemiSmall,
  LineHeightSize.Small,
  LineHeightSize.SemiReduced,
  LineHeightSize.Reduced,
  LineHeightSize.SemiDefault,
]

export const groupNamesGreaterThanDefault: Array<string> = [
  LineHeightSize.Giant,
  LineHeightSize.SemiGiant,
  LineHeightSize.Huge,
  LineHeightSize.SemiHuge,
  LineHeightSize.Large,
  LineHeightSize.SemiLarge,
  LineHeightSize.Increased,
  LineHeightSize.SemiIncreased,
]
