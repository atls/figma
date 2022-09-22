import { Text }     from 'figma-js'

import { Strategy } from './Strategy'

export class SimpleMappingStrategy extends Strategy {
  fillLineHeights(lineHeights) {
    return lineHeights.reduce(
      (result, lineHeight, index) => ({
        ...result,
        [index]: Number(lineHeight),
      }),
      {}
    )
  }

  execute(textNodes: Text[] = []) {
    const stat = this.getStat(textNodes)

    const lineHeights = Array.from(stat.keys()).sort((a, b) => {
      const x: any = a.split('.')
      const y: any = b.split('.')
      return x[0] - y[0] || x[1] - y[1]
    })

    return {
      ...this.fillLineHeights(lineHeights),
    }
  }
}
