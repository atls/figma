import type { Text } from 'figma-js'

export abstract class Strategy {
  getStat(textNodes: Array<Text>): Map<number, number> {
    const stat = new Map<number, number>()

    textNodes.forEach((node) => {
      const fontWeights = Math.round(node.style?.fontWeight)

      stat.set(fontWeights, (stat.get(fontWeights) || 0) + 1)
    })

    return stat
  }

  abstract execute(textNodes: Array<Text>): object
}
