import { Text }                      from 'figma-js'

import { Group }                     from '../Constants'
import { Strategy }                  from './Strategy'
import { groupNamesLessThanDefault } from '../Constants'

export class SimpleMappingStrategy extends Strategy {
  fillSmallSizes(fontSizes) {
    const fontSizeMiddle = Math.ceil(fontSizes.length / 2)

    return fontSizes.reduce((result, fontSize, index) => {
      if (fontSize > fontSizeMiddle) {
        return {
          ...result,
          [groupNamesLessThanDefault[index]]: fontSize,
        }
      }
      return result
    }, {})
  }

  fillNormalSizes(fontSizes) {
    const fontSizeMiddle = Math.ceil(fontSizes.length / 2)

    return fontSizes.reduce((result, fontSize, index) => {
      if (fontSize > fontSizeMiddle) {
        return {
          ...result,
          [groupNamesLessThanDefault[index]]: fontSize,
        }
      }
      return result
    }, {})
  }

  fillMediumSizes(fontSizes) {
    const fontSizeMiddle = Math.ceil(fontSizes.length / 2)

    return fontSizes.reduce((result, fontSize, index) => {
      if (fontSize > fontSizeMiddle) {
        return {
          ...result,
          [groupNamesLessThanDefault[index]]: fontSize,
        }
      }
      return result
    }, {})
  }

  fillLargeSizes(fontSizes) {
    const fontSizeMiddle = Math.ceil(fontSizes.length / 2)

    return fontSizes.reduce((result, fontSize, index) => {
      if (fontSize > fontSizeMiddle) {
        return {
          ...result,
          [groupNamesLessThanDefault[index]]: fontSize,
        }
      }

      return result
    }, {})
  }

  execute(textNodes: Text[] = []) {
    const stat = this.getStat(textNodes)

    const fontSizes = Array.from(stat.keys()).sort((a, b) => a - b)

    const smallSizes = fontSizes.filter((size) => size < 14)
    const normalSizes = fontSizes.filter((size) => size < 24 && size > 14)
    const mediumSizes = fontSizes.filter((size) => size < 50 && size > 24)
    const largeSizes = fontSizes.filter((size) => size > 50)

    return {
      [Group.SMALL]: {
        ...this.fillSmallSizes(smallSizes),
      },
      [Group.NORMAL]: {
        ...this.fillNormalSizes(normalSizes),
      },
      [Group.MEDIUM]: {
        ...this.fillMediumSizes(mediumSizes),
      },
      [Group.LARGE]: {
        ...this.fillLargeSizes(largeSizes),
      },
    }
  }
}
