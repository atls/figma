import type { Paint }           from 'figma-js'
import type { Text }            from 'figma-js'
import type { TypeStyle }       from 'figma-js'

import { createElement }        from 'react'

import { ThemeMappingStrategy } from './theme-mapping.strategy.js'

export class CreateTextStrategy extends ThemeMappingStrategy {
  private createAttributes(style: TypeStyle, fills: readonly Paint[]) {
    const fontSize = style?.fontSize || undefined
    const fontWeight = style?.fontWeight || undefined
    const lineHeightPercentFontSize = style?.lineHeightPercentFontSize || undefined
    const lineHeightPx = style?.lineHeightPx || undefined
    const textAlignHorizontal = style?.textAlignHorizontal || undefined

    return {
      color: this.getColor(fills),
      fontSize: fontSize ? this.getFontSize(fontSize) : undefined,
      fontWeight: this.getFontWeight(fontWeight),
      lineHeight: this.getLineHeight(lineHeightPercentFontSize, lineHeightPx),
      textAlign: this.getTextAlign(textAlignHorizontal),
    }
  }

  getImports() {
    return [`import { Text } from '@ui/text'`, `import { FormattedMessage } from 'react-intl'`]
  }

  createElement(node: Text) {
    const { characters, style, fills } = node

    const childrenElement = createElement('FormattedMessage', {
      id: characters?.replaceAll(' ', '_').toLowerCase() || 'text',
      defaultMessage: characters,
    })

    return createElement('Text', this.createAttributes(style, fills), childrenElement)
  }
}
