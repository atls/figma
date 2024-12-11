import { walk } from '@atls/figma-utils'

export abstract class Strategy {
  abstract execute(radii: number[]): any

  getStat(nodes: any[]): Map<number, number> {
    const stat = new Map<number, number>()

    walk(nodes, (node) => {
      if (node.cornerRadius) {
        const radius = Math.round(node.cornerRadius)
        stat.set(radius, (stat.get(radius) || 0) + 1)
      }

      if (node.rectangleCornerRadii && Array.isArray(node.rectangleCornerRadii)) {
        node.rectangleCornerRadii.forEach((radius) => {
          const roundedRadius = Math.round(radius)
          stat.set(roundedRadius, (stat.get(roundedRadius) || 0) + 1)
        })
      }
    })

    return stat
  }
}
