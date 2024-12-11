import type { Effect }          from 'figma-js'
import type { FrameBase }       from 'figma-js'
import type { Paint }           from 'figma-js'
import type { TypeStyle }       from 'figma-js'

import { toColorOpacityString } from '@atls/figma-utils'
import { toColorString }        from '@atls/figma-utils'
import { toPxString }           from '@atls/figma-utils'

import { THEME_KEY_PREFIX }     from './strategy.constants.js'
import { colorsIgnorePatterns } from './strategy.constants.js'

export class ThemeMappingStrategy {
  private theme: Record<string, Record<string, string>> = {}

  constructor(theme: Record<string, Record<string, string>>) {
    this.theme = theme
  }

  getValueKeyFromTheme(themeKey: string, search: string): string | undefined {
    const vars = this.theme[themeKey]

    if (!vars) {
      return
    }

    const valueKey = Object.entries(vars).find(([key, value]) => {
      if (themeKey === 'colors' && colorsIgnorePatterns.some((pattern) => key.includes(pattern))) {
        return false
      }

      return value === search
    })?.[0]

    return valueKey ? `${THEME_KEY_PREFIX}${valueKey}` : undefined
  }

  getColor(fills: readonly Paint[]): string | undefined {
    if (!fills[0]) {
      return undefined
    }

    const { color, opacity } = fills[0]

    if (!color) {
      return undefined
    }

    if (opacity) {
      const colorOpacityString = toColorOpacityString(color, opacity)

      return this.getValueKeyFromTheme('colors', colorOpacityString) || colorOpacityString
    }

    const colorString = toColorString(color)

    return this.getValueKeyFromTheme('colors', colorString) || colorString
  }

  getFontSize(fontSize: TypeStyle['fontSize']): string {
    const fontSizePx = toPxString(fontSize)

    return this.getValueKeyFromTheme('fontSizes', fontSizePx) || fontSizePx
  }

  getFontWeight(fontWeight: TypeStyle['fontWeight']): string | TypeStyle['fontWeight'] {
    return this.getValueKeyFromTheme('fontWeights', `${fontWeight}`) || fontWeight
  }

  getLineHeight(
    lineHeightPercentFontSize: TypeStyle['lineHeightPercentFontSize'],
    lineHeightPx: TypeStyle['lineHeightPx']
  ): string {
    const lineHeight = ((lineHeightPercentFontSize || 100) / 100)?.toFixed(1)

    return this.getValueKeyFromTheme('lineHeights', lineHeight) || toPxString(lineHeightPx)
  }

  getFlexDirection(layoutMode: FrameBase['layoutMode']): string | undefined {
    return layoutMode === 'VERTICAL' ? 'column' : undefined
  }
}
