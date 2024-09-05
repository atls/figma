import camelCase                     from 'camelcase'
import { FileResponse }              from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { clearStringOfSpecialChars } from '@atls/figma-utils'
import { isColor }                   from '@atls/figma-utils'
import { toColorOpacityString }      from '@atls/figma-utils'
import { toAverage }                 from '@atls/figma-utils'
import { toColorName }               from '@atls/figma-utils'
import { toColorString }             from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

import { INPUT_FIELD_KEY }           from './constants.js'
import { STATE_KEY }                 from './constants.js'
import { STYLE_KEY }                 from './constants.js'
import { TEXT_KEY }                  from './constants.js'
import { TYPE_KEY }                  from './constants.js'
import { ButtonState }               from './Interfaces.js'
import { InputState }                from './Interfaces.js'
import { buttonFrameIds }            from './constants.js'
import { inputFrameIds }             from './constants.js'

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  formatString(str: string): string {
    return camelCase(clearStringOfSpecialChars(str), { pascalCase: false })
  }

  getColor(obj): string {
    if (obj?.type === 'TEXT') {
      return obj.fills[0].opacity
        ? toColorOpacityString(obj.fills[0]?.color, obj.fills[0].opacity)
        : toColorString(obj.fills[0]?.color)
    }
    if (obj?.type === 'INSTANCE') {
      return obj.children[0].fills[0]?.color
        ? toColorString(obj.children[0].fills[0].color)
        : 'rgba(0, 0, 0, 0.00)'
    }
    return 'rgba(0, 0, 0, 0.00)'
  }

  getStateColors(state) {
    return {
      background: state?.backgroundColor
        ? toColorString(state.backgroundColor)
        : 'rgba(0, 0, 0, 0.00)',
      font: this.getColor(state?.children?.find((child) => child?.type === 'TEXT')),
      border: state?.strokes?.[0]?.color
        ? toColorOpacityString(state.strokes[0].color, state.strokes[0]?.opacity)
        : 'none',
    }
  }

  flattenObject(
    object: Record<string, any>,
    parentKey: string = '',
    result: Record<string, any> = {}
  ): Record<string, any> {
    Object.entries(object).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key

      if (typeof value === 'object' && value !== null) {
        this.flattenObject(value, newKey, result)
      } else {
        Object.assign(result, { [newKey]: value })
      }
    })

    return result
  }

  findPropertyValue(properties: string[], key: string) {
    return properties.find((property) => property.startsWith(key))?.slice(key.length)
  }

  getColorsSecondary(nodes): any {
    const colors = {}

    const buttonStatesSet: Map<string, Partial<ButtonState>> = new Map()
    const inputStatesSet: Map<string, Partial<InputState>> = new Map()

    walk(nodes, (node) => {
      if (buttonFrameIds.includes(node.name)) {
        node.children.forEach((button) => {
          const properties: string[] = button.name.split(',').map((name: string) => name.trim())

          const style = this.findPropertyValue(properties, STYLE_KEY)
          const state = this.findPropertyValue(properties, STATE_KEY)
          const text = this.findPropertyValue(properties, TEXT_KEY)

          if (!style || !state || !text || text === 'false') return

          const buttonState = buttonStatesSet.get(this.formatString(style))

          buttonStatesSet.set(this.formatString(style), {
            ...buttonState,
            [this.formatString(state)]: this.getStateColors(button.children[0]),
          })
        })
      }

      if (inputFrameIds.includes(node.name)) {
        node.children.forEach((input) => {
          const properties: string[] = input.name.split(',').map((name: string) => name.trim())

          const type = this.findPropertyValue(properties, TYPE_KEY)
          const state = this.findPropertyValue(properties, STATE_KEY)

          if (!type || !state) return

          const inputState = inputStatesSet.get(this.formatString(type))

          inputStatesSet.set(this.formatString(type), {
            ...inputState,
            [this.formatString(state)]: this.getStateColors(
              input.children.find((item) => item.name === INPUT_FIELD_KEY)
            ),
          })
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

    return {
      ...colorsResult,
      ...this.flattenObject({ button: { ...Object.fromEntries(buttonStatesSet) } }),
      ...this.flattenObject({ input: { ...Object.fromEntries(inputStatesSet) } }),
    }
  }

  getColors(nodes): any {
    const colors = {}
    const buttonNames: string[] = []
    const buttonStates: ButtonState[] = []
    const inputStates: InputState[] = []
    const inputNames: string[] = []

    walk(nodes, (node) => {
      if (buttonFrameIds.includes(node.name)) {
        const names = node.children.map((buttonName) => buttonName.name)

        const buttons = node.children.map((item) => {
          const obj = {
            name: item.name,
            default: item.children[0],
            hover: item.children[1],
            pressed: item.children[2] !== undefined ? item.children[2] : item.children[0],
            disabled: item.children[3] !== undefined ? item.children[3] : item.children[0],
          }

          return {
            default: this.getStateColors(obj.default),
            hover: this.getStateColors(obj.hover),
            pressed: this.getStateColors(obj.pressed),
            disabled: this.getStateColors(obj.disabled),
          }
        })

        buttonStates.push(...buttons)
        names.forEach((buttonName: string) => {
          if (buttonName) {
            buttonNames.push(this.formatString(buttonName))
          }
        })
      }

      if (inputFrameIds.includes(node.name)) {
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

          return {
            default: this.getStateColors(obj.default),
            active: this.getStateColors(obj.active),
            error: this.getStateColors(obj.error),
            focus: this.getStateColors(obj.focus),
            disabled: this.getStateColors(obj.disabled),
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
      (result, name, index) => ({ ...result, [name]: buttonStates[index] }),
      {}
    )

    const inputColorsResult = inputNames.reduce(
      (result, name, index) => ({ ...result, [name]: inputStates[index] }),
      {}
    )

    return {
      ...colorsResult,
      ...this.flattenObject({ button: { ...buttonColorsResult } }),
      ...this.flattenObject({ input: { ...inputColorsResult } }),
    }
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const values =
      this.method === 'secondary'
        ? this.getColorsSecondary(file.document.children)
        : this.getColors(file.document.children)

    return {
      name: this.name,
      content: this.exportValuesTemplate('colors', values),
    }
  }
}
