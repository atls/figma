import type { Text } from 'figma-js'

export abstract class Strategy {
  getStat(textNodes: Array<Text>): Map<string, number> {
    const stat = new Map<string, number>()

    textNodes.forEach((node) => {
      const fontFamily = node.style?.fontFamily

      if (!fontFamily) return

      stat.set(fontFamily, (stat.get(fontFamily) || 0) + 1)
    })

    return stat
  }

  abstract execute(textNodes: Array<Text>): object
}
