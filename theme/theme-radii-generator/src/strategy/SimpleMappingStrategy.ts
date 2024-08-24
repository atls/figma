import { Group }                        from '../Constants.js'
import { RadiiSizeDefaultName }         from '../Constants.js'
import { Strategy }                     from './Strategy.js'
import { groupNamesGreaterThanDefault } from '../Constants.js'
import { groupNamesLessThanDefault }    from '../Constants.js'

export class SimpleMappingStrategy extends Strategy {
  fillSizes(radii) {
    const tempTheme = {}

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

  convertToThemeValues(sizes: {}, group: Group) {
    return Object.entries(sizes).reduce(
      (object, [key, value]) => ({ ...object, [`${group}.${key}`]: `${value}px` }),
      {}
    )
  }

  execute(nodes: any[] = []) {
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
