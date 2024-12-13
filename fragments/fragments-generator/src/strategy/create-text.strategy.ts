import type { Paint }           from 'figma-js'
import type { Text }            from 'figma-js'
import type { TypeStyle }       from 'figma-js'

import { createElement }        from 'react'

import { ThemeMappingStrategy } from './theme-mapping.strategy.js'

export class CreateTextStrategy extends ThemeMappingStrategy {
  constructor(theme: Record<string, Record<string, string>>) {
    super(theme)
  }

  private createAttributes(style: TypeStyle, fills: readonly Paint[]) {
    const { fontSize, fontWeight, lineHeightPercentFontSize, lineHeightPx } = style

    return {
      color: this.getColor(fills),
      fontSize: this.getFontSize(fontSize),
      fontWeight: this.getFontWeight(fontWeight),
      lineHeight: this.getLineHeight(lineHeightPercentFontSize, lineHeightPx),
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
