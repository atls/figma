import type { Node } from 'figma-js'

import { walk }      from '@atls/figma-utils'

export abstract class Strategy {
  getStat(nodes: ReadonlyArray<Node>): Map<number, number> {
    const stat = new Map<number, number>()

    walk(nodes, (node: Node) => {
      if ('cornerRadius' in node && node.cornerRadius) {
        const radius = Math.round(node.cornerRadius)
        stat.set(radius, (stat.get(radius) || 0) + 1)
      }

      if (
        'rectangleCornerRadii' in node &&
        node.rectangleCornerRadii &&
        Array.isArray(node.rectangleCornerRadii)
      ) {
        node.rectangleCornerRadii?.forEach((radius: number) => {
          const roundedRadius = Math.round(radius)
          stat.set(roundedRadius, (stat.get(roundedRadius) || 0) + 1)
        })
      }
    })

    return stat
  }

  abstract execute(radii: ReadonlyArray<Node>): object
}
