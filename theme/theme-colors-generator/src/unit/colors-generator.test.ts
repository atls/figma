import type { FileResponse }         from 'figma-js'

import { FigmaThemeColorsGenerator } from '../FigmaThemeColorsGenerator.js'

describe('FigmaThemeColorsGenerator', () => {
  let generator: FigmaThemeColorsGenerator

  beforeEach(() => {
    generator = new FigmaThemeColorsGenerator()
  })

  it('should generate button colors correctly', () => {
    const file = {
      document: {
        children: [
          {
            name: 'Desktop / Buttons',
            children: [
              {
                name: 'Button 1',
                children: [
                  {
                    backgroundColor: { r: 1, g: 0, b: 0, a: 1 },
                    children: [
                      {
                        type: 'TEXT',
                        fills: [{ color: { r: 2, g: 0, b: 0, a: 1 } }],
                      },
                    ],
                  },
                  {
                    backgroundColor: { r: 3, g: 0, b: 0, a: 1 },
                    children: [
                      {
                        type: 'TEXT',
                        fills: [{ color: { r: 2, g: 2, b: 0, a: 0.3 } }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    }

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'colors',
      content: `export const colors = {
    "button.button1.default.background": "rgba(255, 0, 0, 1)",
    "button.button1.default.font": "rgba(510, 0, 0, 1)",
    "button.button1.default.border": "none",
    "button.button1.hover.background": "rgba(765, 0, 0, 1)",
    "button.button1.hover.font": "rgba(510, 510, 0, 0.30)",
    "button.button1.hover.border": "none",
    "button.button1.pressed.background": "rgba(255, 0, 0, 1)",
    "button.button1.pressed.font": "rgba(510, 0, 0, 1)",
    "button.button1.pressed.border": "none",
    "button.button1.disabled.background": "rgba(255, 0, 0, 1)",
    "button.button1.disabled.font": "rgba(510, 0, 0, 1)",
    "button.button1.disabled.border": "none"
}`,
    })
  })

  it('should generate input colors correctly', () => {
    const file = {
      document: {
        children: [
          {
            name: 'Desktop / Inputs',
            children: [
              {
                name: 'Input 1',
                children: [
                  {
                    backgroundColor: { r: 1, g: 0, b: 0, a: 1 },
                    children: [
                      {
                        type: 'TEXT',
                        fills: [{ color: { r: 2, g: 0, b: 0, a: 1 } }],
                      },
                    ],
                  },
                  {
                    backgroundColor: { r: 3, g: 0, b: 0, a: 1 },
                    children: [
                      {
                        type: 'TEXT',
                        fills: [{ color: { r: 2, g: 2, b: 0, a: 0.3 } }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    }

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'colors',
      content: `export const colors = {
    "input.input1.default.background": "rgba(255, 0, 0, 1)",
    "input.input1.default.font": "rgba(510, 0, 0, 1)",
    "input.input1.default.border": "none",
    "input.input1.active.background": "rgba(765, 0, 0, 1)",
    "input.input1.active.font": "rgba(510, 510, 0, 0.30)",
    "input.input1.active.border": "none",
    "input.input1.error.background": "rgba(0, 0, 0, 0.00)",
    "input.input1.error.font": "rgba(0, 0, 0, 0.00)",
    "input.input1.error.border": "none",
    "input.input1.focus.background": "rgba(0, 0, 0, 0.00)",
    "input.input1.focus.font": "rgba(0, 0, 0, 0.00)",
    "input.input1.focus.border": "none",
    "input.input1.disabled.background": "rgba(255, 0, 0, 1)",
    "input.input1.disabled.font": "rgba(510, 0, 0, 1)",
    "input.input1.disabled.border": "none"
}`,
    })
  })

  it('should handle empty input and button frames', () => {
    const file = {
      document: {
        children: [
          {
            name: 'Desktop / Buttons',
            children: [],
          },
          {
            name: 'Desktop / Inputs',
            children: [],
          },
        ],
      },
    }

    const result = generator.generate(file as unknown as FileResponse)

    expect(result).toEqual({
      name: 'colors',
      content: `export const colors = {}`,
    })
  })
})
