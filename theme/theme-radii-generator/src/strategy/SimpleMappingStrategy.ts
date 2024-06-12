import { Group }                                                                                from '../Constants'
import { RadiiSizeDefaultName }                                                          from '../Constants'
import { groupNamesGreaterThanDefault }                            from '../Constants'
import { groupNamesLessThanDefault } from '../Constants'
import { Strategy }                                                                             from './Strategy'

export class SimpleMappingStrategy extends Strategy {
  fillSizes(radii) {
    const tempTheme = {}

    const middle = Math.floor(radii.length / 2)

    const less = radii.filter((_, index) => index < middle)
    const greater = radii.filter((_, index) => index > middle)

    const groupLess = [...groupNamesLessThanDefault]
    const groupGreater = [...groupNamesGreaterThanDefault]

    if (radii.length === 1) {
      tempTheme[RadiiSizeDefaultName] = radii[0]
    }

    if (radii.length > 1) {
      for (const value of less) {
        const nextGroupName = groupLess.pop()
        tempTheme[nextGroupName as string] = value
      }
    }

    const reversedKeysTheme = Object.keys(tempTheme).reverse()
    const themeValues = Object.values(tempTheme)

    const theme = reversedKeysTheme.reduce(
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
      theme[nextGroupName as string] = value
    }

    return theme
  }

  execute(nodes: any[] = []) {
    const stat = this.getStat(nodes)

    const radii = Array.from(stat.keys()).sort((a, b) => a - b)

    const smallRadii = radii.filter((size) => size < 5)
    const normalRadii = radii.filter((size) => size < 10 && size >= 5)
    const mediumRadii = radii.filter((size) => size < 20 && size >= 10)
    const largeRadii = radii.filter((size) => size >= 20)

    return {
      [Group.SMALL]: {
        ...this.fillSizes(smallRadii),
      },
      [Group.NORMAL]: {
        ...this.fillSizes(normalRadii),
      },
      [Group.MEDIUM]: {
        ...this.fillSizes(mediumRadii),
      },
      [Group.LARGE]: {
        ...this.fillSizes(largeRadii),
      },
    }
  }
}
