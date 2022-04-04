import { Text }            from 'figma-js'

import { FontLargeSizes }  from '../Constants'
import { FontMediumSizes } from '../Constants'
import { FontNormalSizes } from '../Constants'
import { FontSmallSizes }  from '../Constants'
import { Strategy }        from './Strategy'

export class SimpleMappingStrategy extends Strategy {
  fillSmallSizes(fontSizes) {
    return fontSizes.reduce(
      (result, fontSize, index) => ({
        ...result,
        [FontSmallSizes[index]]: fontSize,
      }),
      {}
    )
  }

  fillNormalSizes(fontSizes) {
    return fontSizes.reduce(
      (result, fontSize, index) => ({
        ...result,
        [FontNormalSizes[index]]: fontSize,
      }),
      {}
    )
  }

  fillMediumSizes(fontSizes) {
    return fontSizes.reduce(
      (result, fontSize, index) => ({
        ...result,
        [FontMediumSizes[index]]: fontSize,
      }),
      {}
    )
  }

  fillLargeSizes(fontSizes) {
    return fontSizes.reduce(
      (result, fontSize, index) => ({
        ...result,
        [FontLargeSizes[index]]: fontSize,
      }),
      {}
    )
  }

  execute(textNodes: Text[] = []) {
    const stat = this.getStat(textNodes)

    const fontSizes = Array.from(stat.keys()).sort((a, b) => a - b)
    const [normal] = [...fontSizes].sort((a, b) => (stat.get(b) || 0) - (stat.get(a) || 0))

    const normalIndex = fontSizes.indexOf(normal)
    const mediumIndex = normalIndex + FontNormalSizes.length
    const largeIndex = mediumIndex + FontMediumSizes.length

    const smallSizes = fontSizes.slice(0, normalIndex)
    const normalSizes = fontSizes.slice(normalIndex, mediumIndex)
    const mediumSizes = fontSizes.slice(mediumIndex, largeIndex)
    const largeSizes = fontSizes.slice(largeIndex, fontSizes.length)

    return {
      ...this.fillSmallSizes(smallSizes),
      ...this.fillNormalSizes(normalSizes),
      ...this.fillMediumSizes(mediumSizes),
      ...this.fillLargeSizes(largeSizes),
    }
  }
}
