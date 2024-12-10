import { Frame }                from 'figma-js'
import { createElement }        from 'react'

import { ThemeMappingStrategy } from './theme-mapping.strategy.js'

export class CreateBoxStrategy extends ThemeMappingStrategy {
  constructor(theme: Record<string, Record<string, string>>) {
    super(theme)
  }

  getPaddingFromTheme(padding: number | undefined) {
    if (padding === undefined) {
      return undefined
    }

    return this.getValueKeyFromTheme('spaces', `${padding}px`) || `${padding}px`
  }

  createPaddingAttributes({
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  }: Record<string, number | undefined>) {
    const top = this.getPaddingFromTheme(paddingTop)
    const bottom = this.getPaddingFromTheme(paddingBottom)
    const left = this.getPaddingFromTheme(paddingLeft)
    const right = this.getPaddingFromTheme(paddingRight)

    if ([top, bottom, left, right].every((value) => value && value === top)) {
      return { padding: top }
    }

    const attributes: Record<string, string> = {}

    if (top && bottom && top === bottom) {
      attributes.paddingY = top
    }

    if (left && right && left === right) {
      attributes.paddingX = left
    }

    if (top && !attributes.paddingY) {
      attributes.paddingTop = top
    }

    if (bottom && !attributes.paddingY) {
      attributes.paddingBottom = bottom
    }

    if (left && !attributes.paddingX) {
      attributes.paddingLeft = left
    }

    if (right && !attributes.paddingX) {
      attributes.paddingRight = right
    }

    return attributes
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

    const figmaAlignItems = {
      CENTER: 'center',
      SPACE_BETWEEN: 'space-between',
    }

    return createElement('Box', {
      flexDirection: layoutMode === 'VERTICAL' ? 'column' : undefined,
      justifyContent: figmaAlignItems[primaryAxisAlignItems!] || undefined,
      alignItems: figmaAlignItems[counterAxisAlignItems!] || undefined,
      gap: itemSpacing
        ? this.getValueKeyFromTheme('spaces', `${itemSpacing}px`) || `${itemSpacing}px`
        : undefined,
      ...this.createPaddingAttributes({ paddingBottom, paddingLeft, paddingRight, paddingTop }),
    })
  }
}
