import { Text } from 'figma-js'

export abstract class Strategy {
  abstract execute(textNodes: Text[]): any

  getStat(textNodes: Text[]): Map<string, number> {
    const stat = new Map<string, number>()

    textNodes.forEach((node) => {
      const fonts = node.style.fontFamily

      stat.set(fonts, (stat.get(fonts) || 0) + 1)
    })

    return stat
  }
}
