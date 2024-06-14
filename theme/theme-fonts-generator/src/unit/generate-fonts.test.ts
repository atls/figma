import { FigmaThemeFontsGenerator } from '../FigmaThemeFontsGenerator.js'
import { SimpleMappingStrategy }    from '../strategy/index.js'

describe('FigmaThemeFontsGenerator', () => {
  let generator: FigmaThemeFontsGenerator

  beforeEach(() => {
    generator = new FigmaThemeFontsGenerator()
  })

  it('should correctly identify and return text nodes', () => {
    const nodes = [
      { type: 'TEXT', style: { fontFamily: 'Arial' } },
      { type: 'RECTANGLE' },
      { type: 'TEXT', style: { fontFamily: 'Helvetica' } },
    ]

    const textNodes = generator.getFonts(nodes)

    expect(textNodes).toEqual([
      { type: 'TEXT', style: { fontFamily: 'Arial' } },
      { type: 'TEXT', style: { fontFamily: 'Helvetica' } },
    ])
  })

  it('should generate fonts correctly', () => {
    const file = {
      document: {
        children: [
          {
            type: 'TEXT',
            style: { fontFamily: 'Helvetica' },
          },
          {
            type: 'TEXT',
            style: { fontFamily: 'Arial' },
          },
          {
            type: 'RECTANGLE',
          },
        ],
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'fonts',
      content: `export const fonts = {
    "primary": "Arial",
    "secondary": "Helvetica"
}`,
    })
  })

  it('should map fonts correctly using SimpleMappingStrategy', () => {
    const strategy = new SimpleMappingStrategy()
    const textNodes = [
      { type: 'TEXT', style: { fontFamily: 'Arial' } },
      { type: 'TEXT', style: { fontFamily: 'Helvetica' } },
      { type: 'TEXT', style: { fontFamily: 'Arial' } },
      { type: 'TEXT', style: { fontFamily: 'Helvetica' } },
      { type: 'TEXT', style: { fontFamily: 'Arial' } },
      { type: 'TEXT', style: { fontFamily: 'Arial' } },
      { type: 'TEXT', style: { fontFamily: 'Helvetica' } },
      { type: 'TEXT', style: { fontFamily: 'Helvetica' } },
    ]

    // @ts-ignore
    const result = strategy.execute(textNodes)

    expect(result).toEqual({
      primary: 'Helvetica',
      secondary: 'Arial',
    })
  })

  it('should return empty object if no text nodes found', () => {
    const nodes = [{ type: 'RECTANGLE' }, { type: 'CIRCLE' }]

    const textNodes = generator.getFonts(nodes)

    expect(textNodes).toEqual([])

    const file = {
      document: {
        children: nodes,
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'fonts',
      content: `export const fonts = {}`,
    })
  })
})
