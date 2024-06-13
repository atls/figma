import camelCase                     from 'camelcase'
import { FileResponse }              from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { clearStringOfSpecialChars } from '@atls/figma-utils'
import { isColor }                   from '@atls/figma-utils'
import { toAverage }                 from '@atls/figma-utils'
import { toColorName }               from '@atls/figma-utils'
import { toColorString }             from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

import { getButtonStates }           from './getters'
import { getInputStates }            from './getters'

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  readonly buttonFrameId = 'Desktop / Buttons'

  readonly inputFrameId = 'Desktop / Inputs'

  formatString(str: string): string {
    return camelCase(clearStringOfSpecialChars(str), { pascalCase: false })
  }

  getColor(obj) {
    if (obj.type === 'TEXT') return toColorString(obj.fills[0]?.color)
    if (obj.type === 'INSTANCE')
      return obj.children[0].fills[0]?.color
        ? toColorString(obj.children[0].fills[0].color)
        : 'rgba(0, 0, 0, 0.00)'

    return ''
  }

  getColors(nodes) {
    const colors = {}

    walk(nodes, (node) => {
      if (node.color && isColor(node.color)) {
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
    const colorsResult = this.getColors(file.document.children)

    const { buttonNames, buttonStates } = getButtonStates(
      file.document.children,
      this.buttonFrameId,
      this.getColor.bind(this),
      this.formatString.bind(this)
    )

    const { inputNames, inputStates } = getInputStates(
      file.document.children,
      this.inputFrameId,
      this.getColor.bind(this),
      this.formatString.bind(this)
    )

    const buttonColorsResult = buttonNames.reduce(
      (result, name, index) => ({
        ...result,
        [name]: buttonStates[index],
      }),
      {}
    )

    const inputColorsResult = inputNames.reduce(
      (result, name, index) => ({
        ...result,
        [name]: inputStates[index],
      }),
      {}
    )

    const result = {
      ...colorsResult,
      ...(Object.keys(buttonColorsResult).length ? { button: buttonColorsResult } : {}),
      ...(Object.keys(inputColorsResult).length ? { input: inputColorsResult } : {}),
    }

    return {
      name: this.name,
      content: this.exportValuesTemplate('colors', result),
    }
  }
}
