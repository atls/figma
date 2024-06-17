import camelCase        from 'camelcase'
import { FileResponse } from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { clearStringOfSpecialChars } from '@atls/figma-utils'
import { isColor }                   from '@atls/figma-utils'
import { toColorOpacityString }      from '@atls/figma-utils'
import { toAverage }                 from '@atls/figma-utils'
import { toColorName }               from '@atls/figma-utils'
import { toColorString }             from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

import { ButtonState }               from './Interfaces.js'
import { InputState }                from './Interfaces.js'

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  readonly buttonFrameId = 'Desktop / Buttons'

  readonly inputFrameId = 'Desktop / Inputs'

  formatString(str: string): string {
    return camelCase(clearStringOfSpecialChars(str), { pascalCase: false })
  }

  getColor(obj): string {
    if (obj?.type === 'TEXT') {
      return toColorString(obj.fills[0]?.color)
    }
    if (obj?.type === 'INSTANCE') {
      return obj.children[0].fills[0]?.color
        ? toColorString(obj.children[0].fills[0].color)
        : 'rgba(0, 0, 0, 0.00)'
    }
    return 'rgba(0, 0, 0, 0.00)'
  }

  getColors(nodes): any {
    const colors = {}
    const buttonNames: string[] = []
    const buttonStates: ButtonState[] = []
    const inputStates: InputState[] = []
    const inputNames: string[] = []

    walk(nodes, (node) => {
      const { name } = node

      if (name?.match(this.buttonFrameId)) {
        const names = node.children.map((buttonName) => buttonName.name)

        const buttons = node.children.map((item) => {
          const obj = {
            name: item.name,
            default: item.children[0],
            hover: item.children[1],
            pressed: item.children[2] !== undefined ? item.children[2] : item.children[0],
            disabled: item.children[3] !== undefined ? item.children[3] : item.children[0],
          }

          const getStateColors = (state) => ({
            background: state?.backgroundColor
              ? toColorString(state.backgroundColor)
              : 'rgba(0, 0, 0, 0.00)',
            font: this.getColor(state?.children?.find((child) => child?.type === 'TEXT')),
            border: state?.strokes?.[0]?.color
              ? toColorOpacityString(state.strokes[0].color, state.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)',
          })

          return {
            default: getStateColors(obj.default),
            hover: getStateColors(obj.hover),
            pressed: getStateColors(obj.pressed),
            disabled: getStateColors(obj.disabled),
          }
        })

        buttonStates.push(...buttons)
        names.forEach((buttonName: string) => {
          if (buttonName) {
            buttonNames.push(this.formatString(buttonName))
          }
        })
      }

      if (name?.match(this.inputFrameId)) {
        const names = node.children.map((inputName) => inputName.name)

        const inputs = node.children.map((item) => {
          const obj = {
            name: item.name,
            default: item.children[0],
            active: item.children[1],
            error: item.children[2],
            focus: item.children[3],
            disabled: item.children[4] !== undefined ? item.children[4] : item.children[0],
          }

          const getStateColors = (state) => ({
            background: state?.backgroundColor
              ? toColorString(state.backgroundColor)
              : 'rgba(0, 0, 0, 0.00)',
            font: this.getColor(state?.children?.find((child) => child?.type === 'TEXT')),
            border: state?.strokes?.[0]?.color
              ? toColorOpacityString(state.strokes[0].color, state.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)',
          })

          return {
            default: getStateColors(obj.default),
            active: getStateColors(obj.active),
            error: getStateColors(obj.error),
            focus: getStateColors(obj.focus),
            disabled: getStateColors(obj.disabled),
          }
        })

        inputStates.push(...inputs)
        names.forEach((inputName: string) => {
          if (inputName) {
            inputNames.push(this.formatString(inputName))
          }
        })
      }

      if (node.color && isColor(node.color)) {
        const color = toColorString(node.color)
        if (!colors[color]) {
          colors[color] = node.color
        }
      }
    })

    const colorsResult = Object.keys(colors)
      .sort((a, b) => toAverage(colors[b]) - toAverage(colors[a]))
      .reduce(
        (result, color) => ({
          ...result,
          [toColorName(color, Object.keys(result))]: color,
        }),
        {}
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

    return {
      ...colorsResult,
      ...(Object.keys(buttonColorsResult).length
        ? {
            button: { ...buttonColorsResult },
          }
        : {}),
      ...(Object.keys(inputColorsResult).length ? { input: { ...inputColorsResult } } : {}),
    }
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const values = this.getColors(file.document.children)

    return {
      name: this.name,
      content: this.exportValuesTemplate('colors', values),
    }
  }
}
