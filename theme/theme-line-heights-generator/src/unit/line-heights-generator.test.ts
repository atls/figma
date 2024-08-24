import { Group }                          from '../Constants.js'
import { FigmaThemeLineHeightsGenerator } from '../FigmaThemeLineHeightsGenerator.js'
import { SimpleMappingStrategy }          from '../strategy/index.js'

describe('FigmaThemeLineHeightsGenerator', () => {
  let generator: FigmaThemeLineHeightsGenerator

  beforeEach(() => {
    generator = new FigmaThemeLineHeightsGenerator()
  })

  it('should correctly identify and return text nodes', () => {
    const nodes = [
      { type: 'TEXT', style: { fontSize: 14, lineHeightPx: 21 } },
      { type: 'RECTANGLE' },
      { type: 'TEXT', style: { fontSize: 16, lineHeightPx: 24 } },
    ]

    const textNodes = generator.getLineHeight(nodes)

    expect(textNodes).toEqual([
      { type: 'TEXT', style: { fontSize: 14, lineHeightPx: 21 } },
      { type: 'TEXT', style: { fontSize: 16, lineHeightPx: 24 } },
    ])
  })

  it('should generate line heights correctly', () => {
    const file = {
      document: {
        children: [
          { type: 'TEXT', style: { fontSize: 14, lineHeightPx: 21 } },
          { type: 'TEXT', style: { fontSize: 16, lineHeightPx: 24 } },
          { type: 'RECTANGLE' },
        ],
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'lineHeights',
      content: `export const lineHeights = {
    "medium.default": "1.5"
}`,
    })
  })

  it('should map line heights correctly using SimpleMappingStrategy', () => {
    const strategy = new SimpleMappingStrategy()
    const textNodes = [
      { type: 'TEXT', style: { fontSize: 14, lineHeightPx: 18 } },
      { type: 'TEXT', style: { fontSize: 14, lineHeightPx: 21 } },
      { type: 'TEXT', style: { fontSize: 16, lineHeightPx: 24 } },
    ]

    // @ts-ignore
    const result = strategy.execute(textNodes)

    expect(result).toEqual({
      [`${Group.NORMAL}.default`]: '1.3',
      [`${Group.MEDIUM}.default`]: '1.5',
    })
  })

  it('should return empty object if no text nodes found', () => {
    const nodes = [{ type: 'RECTANGLE' }, { type: 'CIRCLE' }]

    const textNodes = generator.getLineHeight(nodes)

    expect(textNodes).toEqual([])

    const file = {
      document: {
        children: nodes,
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'lineHeights',
      content: `export const lineHeights = {}`,
    })
  })
})
