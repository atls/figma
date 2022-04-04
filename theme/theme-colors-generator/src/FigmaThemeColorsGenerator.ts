import { FileResponse }              from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { isColor }                   from '@atls/figma-utils'
import { toAverage }                 from '@atls/figma-utils'
import { toColorName }               from '@atls/figma-utils'
import { toColorString }             from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  getColors(nodes) {
    const colors = {}

    walk(nodes, (node) => {
      if (node.color && isColor(node.color)) {
        // node fills
        const color = toColorString(node.color)

        if (!colors[color]) {
          colors[color] = node.color
        }
      }
    })

    return Object.keys(colors)
      .sort((a, b) => toAverage(colors[b]) - toAverage(colors[a]))
      .reduce(
        (result, color) => ({
          ...result,
          [toColorName(color, Object.keys(result))]: color,
        }),
        {}
      )
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const values = this.getColors(file.document.children)

    return {
      name: 'colors',
      content: this.exportValuesTemplate('colors', values),
    }
  }
}
