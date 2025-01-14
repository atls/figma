import type { Text }                    from 'figma-js'

import { Group }                        from '../Constants.js'
import { LineHeightSizeDefaultName }    from '../Constants.js'
import { Strategy }                     from './Strategy.js'
import { groupNamesGreaterThanDefault } from '../Constants.js'
import { groupNamesLessThanDefault }    from '../Constants.js'

export class SimpleMappingStrategy extends Strategy {
  fillSizes(lineHeights: Array<number>): {} {
    const tempTheme: Record<string, unknown> = {}

    const middle = Math.floor(lineHeights.length / 2)

    const less = lineHeights.filter((_, index) => index < middle)
    const greater = lineHeights.filter((_, index) => index > middle)

    const groupLess = [...groupNamesLessThanDefault]
    const groupGreater = [...groupNamesGreaterThanDefault]

    if (lineHeights.length === 1) {
      ;[tempTheme[LineHeightSizeDefaultName]] = lineHeights
    }

    if (lineHeights.length > 1) {
      for (const value of less) {
        const nextGroupName = groupLess.pop()

        if (nextGroupName) {
          tempTheme[nextGroupName] = value
        }
      }
    }

    const reversedKeysTheme = Object.keys(tempTheme).reverse()
    const themeValues = Object.values(tempTheme)

    const theme: Record<string, unknown> = reversedKeysTheme.reduce(
      (result, key, index) => ({
        ...result,
        [key]: themeValues[index],
      }),
      {}
    )

    for (const [index, value] of lineHeights.entries()) {
      if (index === middle) {
        theme[LineHeightSizeDefaultName] = value
      }
    }

    for (const value of greater) {
      const nextGroupName = groupGreater.pop()

      if (nextGroupName) {
        theme[nextGroupName] = value
      }
    }

    return theme
  }

  convertToThemeValues(sizes: {}, group: Group): {} {
    return Object.entries(sizes).reduce(
      (object, [key, value]) => ({ ...object, [`${group}.${key}`]: String(value) }),
      {}
    )
  }

  execute(textNodes: Array<Text> = []): {} {
    const stat = this.getStat(textNodes)

    const lineHeights = Array.from(stat.keys()).sort((a, b) => parseFloat(a) - parseFloat(b))

    const smallLineHeights = lineHeights
      .filter((lineHeight) => parseFloat(lineHeight) < 1)
      .map(parseFloat)

    const normalLineHeights = lineHeights
      .filter((lineHeight) => parseFloat(lineHeight) >= 1 && parseFloat(lineHeight) < 1.5)
      .map(parseFloat)

    const mediumLineHeights = lineHeights
      .filter((lineHeight) => parseFloat(lineHeight) >= 1.5 && parseFloat(lineHeight) < 2)
      .map(parseFloat)

    const largeLineHeights = lineHeights
      .filter((lineHeight) => parseFloat(lineHeight) >= 2)
      .map(parseFloat)

    return {
      ...this.convertToThemeValues(this.fillSizes(smallLineHeights), Group.SMALL),
      ...this.convertToThemeValues(this.fillSizes(normalLineHeights), Group.NORMAL),
      ...this.convertToThemeValues(this.fillSizes(mediumLineHeights), Group.MEDIUM),
      ...this.convertToThemeValues(this.fillSizes(largeLineHeights), Group.LARGE),
    }
  }
}
