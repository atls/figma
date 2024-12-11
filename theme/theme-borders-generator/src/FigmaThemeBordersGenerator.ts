import { FileResponse }              from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { toColorName }               from '@atls/figma-utils'
import { toColorOpacityString }      from '@atls/figma-utils'
import { toColorString }             from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

import { Border }                    from './interfaces.js'

export class FigmaThemeBordersGenerator extends FigmaThemeGenerator {
  readonly name = 'borders'

  getBorders(nodes) {
    const borders: Map<string, Border> = new Map()

    walk(nodes, (node) => {
      if (Array.isArray(node.strokes) && node.strokes.length) {
        const weight = node.strokeWeight || 1

        node.strokes.forEach((stroke) => {
          if (!stroke.type || !stroke.color) {
            return
          }

          const type = String(stroke.type).toLowerCase()
          const color = stroke.opacity
            ? toColorOpacityString(stroke.color, stroke.opacity)
            : toColorString(stroke.color)

          const id = `${weight}px ${type} ${color}`

          borders.set(id, { weight, type, color })
        })
      }
    })

    return Array.from(borders.values()).reduce(
      (result, { type, weight, color }) => ({
        ...result,
        [toColorName(color, Object.keys(result))]: `${weight}px ${type} ${color}`,
      }),
      {}
    )
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const values = this.getBorders(file.document.children)

    return {
      name: this.name,
      content: this.exportValuesTemplate('borders', values),
    }
  }
}
