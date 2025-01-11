import type { Text }   from 'figma-js'

import { FontWeights } from '../Constants.js'
import { Strategy }    from './Strategy.js'

export class SimpleMappingStrategy extends Strategy {
  fillWeights(fontWeights: Array<number>): object {
    return fontWeights.reduce((result, fontWeight) => {
      const fontWeightItem = FontWeights.filter((item) => item.value === fontWeight)[0]

      if (fontWeight) return { ...result, [fontWeightItem?.weight]: String(fontWeight) }

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
