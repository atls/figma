import { Text }                 from 'figma-js'
import { plugins }              from 'pretty-format'
import { format }               from 'pretty-format'
import { createElement }        from 'react'

import { toColorOpacityString } from '@atls/figma-utils'
import { toColorString }        from '@atls/figma-utils'
export class SimpleMappingStrategy {
  theme: Record<string, Record<string, string>> = {}

  constructor(theme: Record<string, Record<string, string>>) {
    this.theme = theme
  }

  getValueKeyFromTheme(themeKey: string, value: string) {
    if (!this.theme[themeKey]) {
      return
    }

    const valueKey = Object.entries(this.theme[themeKey]).find((item) => item[1] === value)?.[0]

    return valueKey ? `$${valueKey}` : undefined
  }

  execute(textNodes: Text[] = []) {
    const { name, style, fills } = textNodes[0]

    const { color = { a: 1, b: 0, g: 0, r: 0 }, opacity } = fills[0]

    const element = createElement(
      'Text',
      {
        color:
          this.getValueKeyFromTheme(
            'colors',
            opacity ? toColorOpacityString(color, opacity) : toColorString(color)
          ) || toColorString(color),
        fontSize: this.getValueKeyFromTheme('fontSizes', `${style.fontSize}px`) || style.fontSize,
        fontWeight:
          this.getValueKeyFromTheme('fontWeights', `${style.fontWeight}`) || style.fontWeight,
        lineHeight:
          this.getValueKeyFromTheme(
            'lineHeights',
            `${((style.lineHeightPercentFontSize || 100) / 100)?.toFixed(1)}`
          ) || `${style.lineHeightPx}px`,
      },
      name
    )

    return format(element, {
      plugins: [plugins.ReactElement],
      printFunctionName: false,
    })
  }
}
