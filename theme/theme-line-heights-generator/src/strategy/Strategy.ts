import type { Text } from 'figma-js'

export abstract class Strategy {
  getStat(textNodes: Array<Text>): Map<string, number> {
    const stat = new Map<string, number>()

    textNodes.forEach((node) => {
      const fontSize = Math.round(node.style?.fontSize)
      const lineHeight = Math.round(node.style?.lineHeightPx)

      if (!lineHeight) return

      const result = (lineHeight / fontSize).toFixed(1)

      stat.set(result, (stat.get(result) || 0) + 1)
    })

    return stat
  }

  abstract execute(textNodes: Array<Text>): object
}
