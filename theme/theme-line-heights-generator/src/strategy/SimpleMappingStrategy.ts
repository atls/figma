import { Text }                         from 'figma-js'

import { Group }                        from '../Constants'
import { LineHeightSizeDefaultName }    from '../Constants'
import { Strategy }                     from './Strategy'
import { groupNamesGreaterThanDefault } from '../Constants'
import { groupNamesLessThanDefault }    from '../Constants'

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

  execute(textNodes: Text[] = []) {
    const stat = this.getStat(textNodes)

    const lineHeights = Array.from(stat.keys()).sort((a, b) => parseFloat(a) - parseFloat(b))

    const convertToNumber = (lineHeight) => parseFloat(lineHeight)

    const smallLineHeights = lineHeights.filter((lineHeight) => convertToNumber(lineHeight) < 1)
    const normalLineHeights = lineHeights.filter(
      (lineHeight) => convertToNumber(lineHeight) >= 1 && convertToNumber(lineHeight) < 1.5
    )
    const mediumLineHeights = lineHeights.filter(
      (lineHeight) => convertToNumber(lineHeight) >= 1.5 && convertToNumber(lineHeight) < 2
    )
    const largeLineHeights = lineHeights.filter((lineHeight) => convertToNumber(lineHeight) >= 2)

    return {
      [Group.SMALL]: {
        ...this.fillSizes(smallLineHeights.map(convertToNumber)),
      },
      [Group.NORMAL]: {
        ...this.fillSizes(normalLineHeights.map(convertToNumber)),
      },
      [Group.MEDIUM]: {
        ...this.fillSizes(mediumLineHeights.map(convertToNumber)),
      },
      [Group.LARGE]: {
        ...this.fillSizes(largeLineHeights.map(convertToNumber)),
      },
    }
  }
}
