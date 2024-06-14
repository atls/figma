import { Group }                        from '../Constants.js'
import { FigmaThemeFontSizesGenerator } from '../FigmaThemeFontSizesGenerator.js'
import { SimpleMappingStrategy }        from '../strategy/index.js'

describe('FigmaThemeFontSizesGenerator', () => {
  let generator: FigmaThemeFontSizesGenerator

  beforeEach(() => {
    generator = new FigmaThemeFontSizesGenerator()
  })

  it('should correctly identify and return text nodes', () => {
    const nodes = [
      { type: 'TEXT', style: { fontSize: 16 } },
      { type: 'RECTANGLE' },
      { type: 'TEXT', style: { fontSize: 24 } },
    ]

    const textNodes = generator.getFontSizes(nodes)

    expect(textNodes).toEqual([
      { type: 'TEXT', style: { fontSize: 16 } },
      { type: 'TEXT', style: { fontSize: 24 } },
    ])
  })

  it('should generate font sizes correctly', () => {
    const file = {
      document: {
        children: [
          { type: 'TEXT', style: { fontSize: 16 } },
          { type: 'TEXT', style: { fontSize: 24 } },
          { type: 'RECTANGLE' },
        ],
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'fontSizes',
      content: `export const fontSizes = {
    "small": {},
    "normal": {
        "semiDefault": 16,
        "default": 24
    },
    "medium": {},
    "large": {}
}`,
    })
  })

  it('should map font sizes correctly using SimpleMappingStrategy', () => {
    const strategy = new SimpleMappingStrategy()
    const textNodes = [
      { type: 'TEXT', style: { fontSize: 14 } },
      { type: 'TEXT', style: { fontSize: 18 } },
      { type: 'TEXT', style: { fontSize: 28 } },
    ]

    // @ts-ignore
    const result = strategy.execute(textNodes)

    expect(result).toEqual({
      [Group.SMALL]: {
        default: 14,
      },
      [Group.NORMAL]: {
        default: 18,
      },
      [Group.MEDIUM]: {
        default: 28,
      },
      [Group.LARGE]: {},
    })
  })

  it('should return empty object if no text nodes found', () => {
    const nodes = [{ type: 'RECTANGLE' }, { type: 'CIRCLE' }]

    const textNodes = generator.getFontSizes(nodes)

    expect(textNodes).toEqual([])

    const file = {
      document: {
        children: nodes,
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'fontSizes',
      content: `export const fontSizes = {
    "small": {},
    "normal": {},
    "medium": {},
    "large": {}
}`,
    })
  })
})
