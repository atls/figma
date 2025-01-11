import type { Frame }           from 'figma-js'
import type { ReactElement }    from 'react'

import { createElement }        from 'react'

import { ThemeMappingStrategy } from '../theme-mapping/index.js'

export class CreateBoxStrategy extends ThemeMappingStrategy {
  getImports(): Array<string> {
    return [`import { Box } from '@ui/layout'`]
  }

  createElement(node: Frame): ReactElement {
    const {
      layoutMode,
      itemSpacing,
      counterAxisAlignItems,
      primaryAxisAlignItems,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      cornerRadius,
      strokes,
      strokeWeight,
      background,
      effects,
      absoluteBoundingBox,
    } = node

    return createElement('Box', {
      width: absoluteBoundingBox.width ? `${absoluteBoundingBox.width}px` : undefined,
      height: absoluteBoundingBox.height ? `${absoluteBoundingBox.height}px` : undefined,
      flexDirection: this.getFlexDirection(layoutMode),
      justifyContent: this.getJustifyContent(primaryAxisAlignItems),
      alignItems: this.getAlignItems(counterAxisAlignItems),
      background: this.getColor(background),
      gap: this.getGap(itemSpacing),
      border: this.getBorder(strokes, strokeWeight),
      borderRadius: this.getBorderRadius(cornerRadius),
      boxShadow: this.getShadow(effects),
      ...this.getPaddings({ paddingBottom, paddingLeft, paddingRight, paddingTop }),
    })
  }
}
