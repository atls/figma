import type { FileResponse }          from 'figma-js'
import type { Node }                  from 'figma-js'

import { describe }                   from 'node:test'
import { beforeEach }                 from 'node:test'
import { it }                         from 'node:test'

import { expect }                     from 'playwright/test'

import { FigmaThemeBordersGenerator } from '../FigmaThemeBordersGenerator.js'

describe('FigmaThemeBordersGenerator', () => {
  let generator: FigmaThemeBordersGenerator

  beforeEach(() => {
    generator = new FigmaThemeBordersGenerator()
  })

  const nodes = [
    {
      strokeWeight: 1,
      strokes: [
        {
          blendMode: 'NORMAL',
          type: 'SOLID',
          color: { r: 0, g: 0, b: 0, a: 1 },
        },
      ],
    },
    {
      strokeWeight: 1,
      strokes: [
        {
          opacity: 0.75,
          blendMode: 'NORMAL',
          type: 'SOLID',
          color: { r: 0, g: 0, b: 0, a: 1 },
        },
      ],
    },
    {
      strokeWeight: 3,
      strokes: [
        {
          blendMode: 'NORMAL',
          type: 'DASHED',
          color: { r: 1, g: 0, b: 0, a: 1 },
        },
      ],
    },
  ]

  it('should correctly identify and return borders', () => {
    const borders = generator.getBorders(nodes as never as ReadonlyArray<Node>)

    expect(borders).toEqual({
      black: '1px solid rgba(0, 0, 0, 1)',
      codgray: '1px solid rgba(0, 0, 0, 0.75)',
      red: '3px dashed rgba(255, 0, 0, 1)',
    })
  })

  it('should generate borders correctly', () => {
    const file = {
      document: {
        children: nodes,
      },
    }

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'borders',
      content: `export const borders = {
    "black": "1px solid rgba(0, 0, 0, 1)",
    "codgray": "1px solid rgba(0, 0, 0, 0.75)",
    "red": "3px dashed rgba(255, 0, 0, 1)"
}`,
    })
  })

  it('should return empty object if no borders found', () => {
    const borderlessNodes = [{ type: 'TEXT', style: { fontSize: 20 } }]

    const borders = generator.getBorders(borderlessNodes as never as ReadonlyArray<Node>)

    expect(borders).toEqual({})

    const file = {
      document: {
        children: borderlessNodes,
      },
    }

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'borders',
      content: `export const borders = {}`,
    })
  })
})
