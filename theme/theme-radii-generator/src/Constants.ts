// eslint-disable-next-line no-shadow
export enum Group {
  SMALL = 'small',
  NORMAL = 'normal',
  MEDIUM = 'medium',
  LARGE = 'large',
}

// eslint-disable-next-line no-shadow
export enum RadiiSize {
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

export const RadiiSizeDefaultName = RadiiSize.Default

export const groupNamesLessThanDefault: Array<string> = [
  RadiiSize.SemiTiny,
  RadiiSize.Tiny,
  RadiiSize.SemiSmall,
  RadiiSize.Small,
  RadiiSize.SemiReduced,
  RadiiSize.Reduced,
  RadiiSize.SemiDefault,
]

export const groupNamesGreaterThanDefault: Array<string> = [
  RadiiSize.Giant,
  RadiiSize.SemiGiant,
  RadiiSize.Huge,
  RadiiSize.SemiHuge,
  RadiiSize.Large,
  RadiiSize.SemiLarge,
  RadiiSize.Increased,
  RadiiSize.SemiIncreased,
]
