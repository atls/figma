import { Frame }                from 'figma-js'
import { createElement }        from 'react'

import { ThemeMappingStrategy } from './theme-mapping.strategy.js'

export class CreateBoxStrategy extends ThemeMappingStrategy {
  constructor(theme: Record<string, Record<string, string>>) {
    super(theme)
  }

  getImports() {
    return [`import { Box } from '@ui/layout'`]
  }

  createElement(node: Frame) {
    const {
      layoutMode,
      itemSpacing,
      counterAxisAlignItems,
      primaryAxisAlignItems,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
    } = node

    return createElement('Box', {
      flexDirection: this.getFlexDirection(layoutMode),
      justifyContent: this.getJustifyContent(primaryAxisAlignItems),
      alignItems: this.getAlignItems(counterAxisAlignItems),
      gap: this.getGap(itemSpacing),
      ...this.getPaddings({ paddingBottom, paddingLeft, paddingRight, paddingTop }),
    })
  }
}
