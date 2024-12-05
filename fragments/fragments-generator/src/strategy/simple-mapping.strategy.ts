import { Paint }                from 'figma-js'
import { Text }                 from 'figma-js'
import { TypeStyle }            from 'figma-js'
import { ReactElement }         from 'react'
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

    const valueKey = Object.entries(this.theme[themeKey]).find(
      (item) => item[1] === value && !['button', 'input'].includes(item[0])
    )?.[0]

    return valueKey ? `$${valueKey}` : undefined
  }

  createTextAttributes(style: TypeStyle, fills: readonly Paint[]) {
    const { color = { a: 1, b: 0, g: 0, r: 0 }, opacity } = fills[0]

    const stringColor = toColorString(color)
    const themeColor = opacity ? toColorOpacityString(color, opacity) : stringColor

    const themeLineHeight = ((style.lineHeightPercentFontSize || 100) / 100)?.toFixed(1)

    return {
      color: this.getValueKeyFromTheme('colors', themeColor) || stringColor,
      fontSize: this.getValueKeyFromTheme('fontSizes', `${style.fontSize}px`) || style.fontSize,
      fontWeight:
        this.getValueKeyFromTheme('fontWeights', `${style.fontWeight}`) || style.fontWeight,
      lineHeight:
        this.getValueKeyFromTheme('lineHeights', themeLineHeight) || `${style.lineHeightPx}px`,
    }
  }

  execute(textNodes: Text[] = []) {
    const elements: ReactElement[] = []

    textNodes.forEach((node) => {
      const { name, style, fills } = node

      elements.push(createElement('Text', this.createTextAttributes(style, fills), name))
    })

    const fragment = elements.length === 1 ? elements[0] : createElement('Box', {}, elements)

    return format(fragment, {
      plugins: [plugins.ReactElement],
      printFunctionName: false,
    })
  }
}
