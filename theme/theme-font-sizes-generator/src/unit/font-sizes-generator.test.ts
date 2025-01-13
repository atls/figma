import type { FileResponse }            from 'figma-js'
import type { Text }                    from 'figma-js'
import type { Node }                    from 'figma-js'

import { describe }                     from 'node:test'
import { beforeEach }                   from 'node:test'
import { it }                           from 'node:test'

import { expect }                       from 'playwright/test'

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

    const textNodes = generator.getFontSizes(nodes as never as ReadonlyArray<Node>)

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

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'fontSizes',
      content: `export const fontSizes = {
    "normal.semiDefault": "16px",
    "normal.default": "24px"
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

    const result = strategy.execute(textNodes as unknown as Array<Text>)

    expect(result).toEqual({
      [`${Group.SMALL}.default`]: '14px',
      [`${Group.NORMAL}.default`]: '18px',
      [`${Group.MEDIUM}.default`]: '28px',
    })
  })

  it('should return empty object if no text nodes found', () => {
    const nodes = [{ type: 'RECTANGLE' }, { type: 'CIRCLE' }]

    const textNodes = generator.getFontSizes(nodes as never as ReadonlyArray<Node>)

    expect(textNodes).toEqual([])

    const file = {
      document: {
        children: nodes,
      },
    }

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'fontSizes',
      content: `export const fontSizes = {}`,
    })
  })
})
