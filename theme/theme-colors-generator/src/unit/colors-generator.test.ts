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

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'colors',
      content: `export const colors = {
    "button.button1.default.background": "rgb(255, 0, 0)",
    "button.button1.default.font": "rgb(510, 0, 0)",
    "button.button1.default.border": "rgba(0, 0, 0, 0.00)",
    "button.button1.hover.background": "rgb(765, 0, 0)",
    "button.button1.hover.font": "rgba(510, 510, 0, 0.30)",
    "button.button1.hover.border": "rgba(0, 0, 0, 0.00)",
    "button.button1.pressed.background": "rgb(255, 0, 0)",
    "button.button1.pressed.font": "rgb(510, 0, 0)",
    "button.button1.pressed.border": "rgba(0, 0, 0, 0.00)",
    "button.button1.disabled.background": "rgb(255, 0, 0)",
    "button.button1.disabled.font": "rgb(510, 0, 0)",
    "button.button1.disabled.border": "rgba(0, 0, 0, 0.00)"
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

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'colors',
      content: `export const colors = {
    "input.input1.default.background": "rgb(255, 0, 0)",
    "input.input1.default.font": "rgb(510, 0, 0)",
    "input.input1.default.border": "rgba(0, 0, 0, 0.00)",
    "input.input1.active.background": "rgb(765, 0, 0)",
    "input.input1.active.font": "rgba(510, 510, 0, 0.30)",
    "input.input1.active.border": "rgba(0, 0, 0, 0.00)",
    "input.input1.error.background": "rgba(0, 0, 0, 0.00)",
    "input.input1.error.font": "rgba(0, 0, 0, 0.00)",
    "input.input1.error.border": "rgba(0, 0, 0, 0.00)",
    "input.input1.focus.background": "rgba(0, 0, 0, 0.00)",
    "input.input1.focus.font": "rgba(0, 0, 0, 0.00)",
    "input.input1.focus.border": "rgba(0, 0, 0, 0.00)",
    "input.input1.disabled.background": "rgb(255, 0, 0)",
    "input.input1.disabled.font": "rgb(510, 0, 0)",
    "input.input1.disabled.border": "rgba(0, 0, 0, 0.00)"
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

    // @ts-ignore
    const result = generator.generate(file)

    expect(result).toEqual({
      name: 'colors',
      content: `export const colors = {}`,
    })
  })
})
