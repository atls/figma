import { Group }                    from '../Constants.js'
import { FigmaThemeRadiiGenerator } from '../FigmaThemeRadiiGenerator.js'
import { SimpleMappingStrategy }    from '../strategy/index.js'

describe('FigmaThemeRadiiGenerator', () => {
  let generator: FigmaThemeRadiiGenerator

  beforeEach(() => {
    generator = new FigmaThemeRadiiGenerator()
  })

  it('should correctly identify and return nodes with radii', () => {
    const nodes = [
      { cornerRadius: 3 },
      { type: 'RECTANGLE', rectangleCornerRadii: [2, 3, 4, 5] },
      { type: 'TEXT', style: { fontSize: 16 } },
    ]

    const radii = generator.getRadii(nodes)

    expect(radii).toEqual({
      [Group.SMALL]: {
        semiDefault: 2,
        default: 3,
        semiIncreased: 4,
      },
      [Group.NORMAL]: {
        default: 5,
      },
      [Group.MEDIUM]: {},
      [Group.LARGE]: {},
    })
  })

  it('should generate radii correctly', () => {
    const file = {
      document: {
        children: [
          { cornerRadius: 3 },
          { type: 'RECTANGLE', rectangleCornerRadii: [2, 3, 4, 5] },
          { type: 'TEXT', style: { fontSize: 16 } },
        ],
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'radii',
      content: `export const radii = {
    "small": {
        "semiDefault": 2,
        "default": 3,
        "semiIncreased": 4
    },
    "normal": {
        "default": 5
    },
    "medium": {},
    "large": {}
}`,
    })
  })

  it('should map radii correctly using SimpleMappingStrategy', () => {
    const strategy = new SimpleMappingStrategy()
    const nodes = [
      { cornerRadius: 2 },
      { cornerRadius: 3 },
      { cornerRadius: 5 },
      { cornerRadius: 10 },
      { cornerRadius: 20 },
    ]

    // @ts-ignore
    const result = strategy.execute(nodes)

    expect(result).toEqual({
      [Group.SMALL]: {
        semiDefault: 2,
        default: 3,
      },
      [Group.NORMAL]: {
        default: 5,
      },
      [Group.MEDIUM]: {
        default: 10,
      },
      [Group.LARGE]: {
        default: 20,
      },
    })
  })

  it('should return empty object if no nodes with radii found', () => {
    const nodes = [{ type: 'TEXT', style: { fontSize: 16 } }]

    const radii = generator.getRadii(nodes)

    expect(radii).toEqual({
      [Group.SMALL]: {},
      [Group.NORMAL]: {},
      [Group.MEDIUM]: {},
      [Group.LARGE]: {},
    })

    const file = {
      document: {
        children: nodes,
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'radii',
      content: `export const radii = {
    "small": {},
    "normal": {},
    "medium": {},
    "large": {}
}`,
    })
  })
})
