import { Paint }                from 'figma-js'
import { Text }                 from 'figma-js'
import { TypeStyle }            from 'figma-js'
import { createElement }        from 'react'

import { toColorOpacityString } from '@atls/figma-utils'
import { toColorString }        from '@atls/figma-utils'

import { ThemeMappingStrategy } from './theme-mapping.strategy.js'
import { defaultFigmaColor }    from './strategy.constants.js'

export class CreateTextStrategy extends ThemeMappingStrategy {
  constructor(theme: Record<string, Record<string, string>>) {
    super(theme)
  }

  private createAttributes(style: TypeStyle, fills: readonly Paint[]) {
    const { color = defaultFigmaColor, opacity } = fills[0]

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

  getImports() {
    return [`import { Text } from '@ui/text'`, `import { FormattedMessage } from 'react-intl'`]
  }

  createElement(node: Text) {
    const { characters, style, fills } = node

    const childrenElement = createElement('FormattedMessage', { defaultMessage: characters })

    return createElement('Text', this.createAttributes(style, fills), childrenElement)
  }
}
