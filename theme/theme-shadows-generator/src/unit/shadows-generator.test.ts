import { FigmaThemeShadowsGenerator } from '../FigmaThemeShadowsGenerator.js'

describe('FigmaThemeShadowsGenerator', () => {
  let generator: FigmaThemeShadowsGenerator

  beforeEach(() => {
    generator = new FigmaThemeShadowsGenerator()
  })

  it('should correctly identify and return shadows', () => {
    const nodes = [
      {
        type: 'DROP_SHADOW',
        offset: { x: 10, y: 20 },
        radius: 15,
        spread: 5,
        color: { r: 1, g: 0, b: 0, a: 0.5 },
      },
      {
        type: 'INNER_SHADOW',
        offset: { x: 5, y: 10 },
        radius: 10,
        color: { r: 0, g: 0, b: 0, a: 0.75 },
      },
      {
        type: 'TEXT',
        style: { fontSize: 16 },
      },
    ]

    const shadows = generator.getShadows(nodes)

    expect(shadows).toEqual({
      red: '10px 20px 15px 5px rgba(255, 0, 0, 0.50)',
      black: '5px 10px 10px rgba(0, 0, 0, 0.75)',
    })
  })

  it('should generate shadows correctly', () => {
    const file = {
      document: {
        children: [
          {
            type: 'DROP_SHADOW',
            offset: { x: 10, y: 20 },
            radius: 15,
            spread: 5,
            color: { r: 1, g: 0, b: 0, a: 0.5 },
          },
          {
            type: 'INNER_SHADOW',
            offset: { x: 5, y: 10 },
            radius: 10,
            color: { r: 0, g: 0, b: 0, a: 0.75 },
          },
        ],
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'shadows',
      content: `export const shadows = {
    "red": "10px 20px 15px 5px rgba(255, 0, 0, 0.50)",
    "black": "5px 10px 10px rgba(0, 0, 0, 0.75)"
}`,
    })
  })

  it('should return empty object if no shadows found', () => {
    const nodes = [{ type: 'TEXT', style: { fontSize: 16 } }]

    const shadows = generator.getShadows(nodes)

    expect(shadows).toEqual({})

    const file = {
      document: {
        children: nodes,
      },
    }

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'shadows',
      content: `export const shadows = {}`,
    })
  })
})
