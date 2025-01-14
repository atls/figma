import type { FileResponse }        from 'figma-js'
import type { Text }                from 'figma-js'
import type { Node }                from 'figma-js'

import { describe }                 from 'node:test'
import { beforeEach }               from 'node:test'
import { it }                       from 'node:test'

import { expect }                   from 'playwright/test'

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

    const textNodes = generator.getFonts(nodes as never as ReadonlyArray<Node>)

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

    const result = generator.generate(file as never as FileResponse)

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

    const result = strategy.execute(textNodes as Array<Text>)

    expect(result).toEqual({
      primary: 'Helvetica',
      secondary: 'Arial',
    })
  })

  it('should return empty object if no text nodes found', () => {
    const nodes = [{ type: 'RECTANGLE' }, { type: 'CIRCLE' }]

    const textNodes = generator.getFonts(nodes as never as ReadonlyArray<Node>)

    expect(textNodes).toEqual([])

    const file = {
      document: {
        children: nodes,
      },
    }

    const result = generator.generate(file as never as FileResponse)

    expect(result).toEqual({
      name: 'fonts',
      content: `export const fonts = {}`,
    })
  })
})
