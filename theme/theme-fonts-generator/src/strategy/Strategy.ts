import { Text } from 'figma-js'

export abstract class Strategy {
  abstract execute(textNodes: Text[]): any

  getStat(textNodes: Text[]): Map<string, number> {
    const stat = new Map<string, number>()

    textNodes.forEach((node) => {
      const { fontFamily } = node.style

      stat.set(fontFamily, (stat.get(fontFamily) || 0) + 1)
    })

    return stat
  }
}
