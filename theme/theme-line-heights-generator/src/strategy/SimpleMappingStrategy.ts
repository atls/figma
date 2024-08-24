import { Text }                         from 'figma-js'

import { Group }                        from '../Constants.js'
import { LineHeightSizeDefaultName }    from '../Constants.js'
import { Strategy }                     from './Strategy.js'
import { groupNamesGreaterThanDefault } from '../Constants.js'
import { groupNamesLessThanDefault }    from '../Constants.js'

export class SimpleMappingStrategy extends Strategy {
  fillSizes(lineHeights) {
    const tempTheme = {}

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

        tempTheme[nextGroupName as string] = value
      }
    }

    const reversedKeysTheme = Object.keys(tempTheme).reverse()
    const themeValues = Object.values(tempTheme)

    const theme = reversedKeysTheme.reduce(
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

      theme[nextGroupName as string] = value
    }

    return theme
  }

  convertToThemeValues(sizes: {}, group: Group) {
    return Object.entries(sizes).reduce(
      (object, [key, value]) => ({ ...object, [`${group}.${key}`]: String(value) }),
      {}
    )
  }

  execute(textNodes: Text[] = []) {
    const stat = this.getStat(textNodes)

    const lineHeights = Array.from(stat.keys()).sort((a, b) => parseFloat(a) - parseFloat(b))

    const convertToNumber = (lineHeight) => parseFloat(lineHeight)

    const smallLineHeights = lineHeights
      .filter((lineHeight) => convertToNumber(lineHeight) < 1)
      .map(convertToNumber)

    const normalLineHeights = lineHeights
      .filter((lineHeight) => convertToNumber(lineHeight) >= 1 && convertToNumber(lineHeight) < 1.5)
      .map(convertToNumber)

    const mediumLineHeights = lineHeights
      .filter((lineHeight) => convertToNumber(lineHeight) >= 1.5 && convertToNumber(lineHeight) < 2)
      .map(convertToNumber)

    const largeLineHeights = lineHeights
      .filter((lineHeight) => convertToNumber(lineHeight) >= 2)
      .map(convertToNumber)

    return {
      ...this.convertToThemeValues(this.fillSizes(smallLineHeights), Group.SMALL),
      ...this.convertToThemeValues(this.fillSizes(normalLineHeights), Group.NORMAL),
      ...this.convertToThemeValues(this.fillSizes(mediumLineHeights), Group.MEDIUM),
      ...this.convertToThemeValues(this.fillSizes(largeLineHeights), Group.LARGE),
    }
  }
}
