import type { Text }                    from 'figma-js'

import { FontSizeDefaultName }          from '../Constants.js'
import { Group }                        from '../Constants.js'
import { Strategy }                     from './Strategy.js'
import { groupNamesGreaterThanDefault } from '../Constants.js'
import { groupNamesLessThanDefault }    from '../Constants.js'

export class SimpleMappingStrategy extends Strategy {
  fillSizes(fontSizes: Array<number>): object {
    const tempTheme: Record<string, unknown> = {}

    const middle = Math.floor(fontSizes.length / 2)

    const less = fontSizes.filter((_, index) => index < middle)
    const greater = fontSizes.filter((_, index) => index > middle)

    const groupLess = [...groupNamesLessThanDefault]
    const groupGreater = [...groupNamesGreaterThanDefault]

    if (fontSizes.length === 1) {
      tempTheme[FontSizeDefaultName] = fontSizes
    }

    if (fontSizes.length > 1) {
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

    for (const [index, value] of fontSizes.entries()) {
      if (index === middle) {
        theme[FontSizeDefaultName] = value
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

  convertToThemeValues(sizes: object, group: Group): object {
    return Object.entries(sizes).reduce(
      (object, [key, value]) => ({ ...object, [`${group}.${key}`]: `${value}px` }),
      {}
    )
  }

  execute(textNodes: Array<Text> = []): object {
    const stat = this.getStat(textNodes)

    const fontSizes = Array.from(stat.keys()).sort((a, b) => a - b)

    const smallSizes = fontSizes.filter((size) => size <= 14)
    const normalSizes = fontSizes.filter((size) => size <= 24 && size > 14)
    const mediumSizes = fontSizes.filter((size) => size <= 50 && size > 24)
    const largeSizes = fontSizes.filter((size) => size > 50)

    return {
      ...this.convertToThemeValues(this.fillSizes(smallSizes), Group.SMALL),
      ...this.convertToThemeValues(this.fillSizes(normalSizes), Group.NORMAL),
      ...this.convertToThemeValues(this.fillSizes(mediumSizes), Group.MEDIUM),
      ...this.convertToThemeValues(this.fillSizes(largeSizes), Group.LARGE),
    }
  }
}
