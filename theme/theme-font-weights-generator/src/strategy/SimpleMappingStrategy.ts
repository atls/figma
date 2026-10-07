import type { Text }   from 'figma-js'

import { FontWeights } from '../Constants.js'
import { Strategy }    from './Strategy.js'

export class SimpleMappingStrategy extends Strategy {
  fillWeights(fontWeights: Array<number>): object {
    return fontWeights.reduce((result, fontWeight) => {
      const fontWeightItem = FontWeights.find((item) => item.value === fontWeight)

      if (fontWeight) return { ...result, [String(fontWeightItem?.weight)]: String(fontWeight) }

      return false
    }, {})
  }

  execute(textNodes: Array<Text> = []): object {
    const stat = this.getStat(textNodes)

    const fontWeights = Array.from(stat.keys()).sort((a, b) => a - b)

    return {
      ...this.fillWeights(fontWeights),
    }
  }
}
