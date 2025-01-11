import type { Node }                    from 'figma-js'

import { Group }                        from '../Constants.js'
import { RadiiSizeDefaultName }         from '../Constants.js'
import { Strategy }                     from './Strategy.js'
import { groupNamesGreaterThanDefault } from '../Constants.js'
import { groupNamesLessThanDefault }    from '../Constants.js'

export class SimpleMappingStrategy extends Strategy {
  fillSizes(radii: Array<number>): object {
    const tempTheme: Record<string, number> = {}

    const middle = Math.floor(radii.length / 2)

    const less = radii.filter((_, index) => index < middle)
    const greater = radii.filter((_, index) => index > middle)

    const groupLess = [...groupNamesLessThanDefault]
    const groupGreater = [...groupNamesGreaterThanDefault]

    if (radii.length === 1) {
      const [firstRadius] = radii
      tempTheme[RadiiSizeDefaultName] = firstRadius
    }

    if (radii.length > 1) {
      for (const value of less) {
        const nextGroupName = groupLess.pop()

        if (nextGroupName) {
          tempTheme[nextGroupName] = value
        }
      }
    }

    const reversedKeysTheme = Object.keys(tempTheme).reverse()
    const themeValues = Object.values(tempTheme)

    const theme: Record<string, unknown> = reversedKeysTheme.reduce(
      (result, key, index) => ({
        ...result,
        [key]: themeValues[index],
      }),
      {}
    )

    for (const [index, value] of radii.entries()) {
      if (index === middle) {
        theme[RadiiSizeDefaultName] = value
      }
    }

    for (const value of greater) {
      const nextGroupName = groupGreater.pop()

      if (nextGroupName) {
        theme[nextGroupName] = value
      }
    }

    return theme
  }

  convertToThemeValues(sizes: {}, group: Group): object {
    return Object.entries(sizes).reduce(
      (object, [key, value]) => ({ ...object, [`${group}.${key}`]: `${String(value)}px` }),
      {}
    )
  }

  execute(nodes: ReadonlyArray<Node> = []): object {
    const stat = this.getStat(nodes)

    const radii = Array.from(stat.keys()).sort((a, b) => a - b)

    const smallRadii = radii.filter((size) => size < 5)
    const normalRadii = radii.filter((size) => size < 10 && size >= 5)
    const mediumRadii = radii.filter((size) => size < 20 && size >= 10)
    const largeRadii = radii.filter((size) => size >= 20)

    return {
      ...this.convertToThemeValues(this.fillSizes(smallRadii), Group.SMALL),
      ...this.convertToThemeValues(this.fillSizes(normalRadii), Group.NORMAL),
      ...this.convertToThemeValues(this.fillSizes(mediumRadii), Group.MEDIUM),
      ...this.convertToThemeValues(this.fillSizes(largeRadii), Group.LARGE),
    }
  }
}
