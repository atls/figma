import type { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import type { FileResponse }              from 'figma-js'
import type { Node }                      from 'figma-js'
import type { Color }                     from 'figma-js'

import type { ButtonState }               from './Interfaces.js'
import type { InputState }                from './Interfaces.js'
import type { StateColors }               from './Interfaces.js'

import camelCase                          from 'camelcase'

import { FigmaThemeGenerator }            from '@atls/figma-theme-generator-common'
import { clearStringOfSpecialChars }      from '@atls/figma-utils'
import { isText }                         from '@atls/figma-utils'
import { isInstance }                     from '@atls/figma-utils'
import { isColor }                        from '@atls/figma-utils'
import { toColorOpacityString }           from '@atls/figma-utils'
import { toAverage }                      from '@atls/figma-utils'
import { toColorName }                    from '@atls/figma-utils'
import { toColorString }                  from '@atls/figma-utils'
import { walk }                           from '@atls/figma-utils'

import { INPUT_FIELD_KEY }                from './constants.js'
import { STATE_KEY }                      from './constants.js'
import { STYLE_KEY }                      from './constants.js'
import { TEXT_KEY }                       from './constants.js'
import { TYPE_KEY }                       from './constants.js'
import { buttonFrameIds }                 from './constants.js'
import { inputFrameIds }                  from './constants.js'

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  formatString(str: string): string {
    return camelCase(clearStringOfSpecialChars(str), { pascalCase: false })
  }

  getColor(obj: Node): string {
    if (isText(obj) && obj.fills[0].color) {
      return obj.fills[0].opacity
        ? toColorOpacityString(obj.fills[0].color, obj.fills[0].opacity)
        : toColorString(obj.fills[0]?.color)
    }
    if (isInstance(obj) && 'fills' in obj.children[0]) {
      return obj.children[0].fills[0]?.color
        ? toColorString(obj.children[0].fills[0].color)
        : 'rgba(0, 0, 0, 0.00)'
    }
    return 'rgba(0, 0, 0, 0.00)'
  }

  getStateColors(state: Node | undefined): StateColors {
    let background = 'rgba(0, 0, 0, 0.00)'
    let font = ''
    let border = 'none'

    if (!state) {
      return { background, font, border }
    }

    if ('backgroundColor' in state && state.backgroundColor) {
      background = toColorString(state.backgroundColor)
    }

    if ('children' in state) {
      const text = state.children.find((child) => isText(child))
      font = text ? this.getColor(text) : font
    }

    if ('strokes' in state && state.strokes?.[0]?.color) {
      border = toColorOpacityString(state.strokes[0].color, state.strokes[0]?.opacity || 1)
    }

    return { background, font, border }
  }

  flattenObject(object: object, parentKey: string = '', result: object = {}): object {
    Object.entries(object).forEach(([key, value]) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key

      if (typeof value === 'object' && value !== null) {
        this.flattenObject(value as object, newKey, result)
      } else {
        Object.assign(result, { [newKey]: value })
      }
    })

    return result
  }

  findPropertyValue(properties: Array<string>, key: string): string | undefined {
    return properties.find((property) => property.startsWith(key))?.slice(key.length)
  }

  getColorsSecondary(nodes: ReadonlyArray<Node>): object {
    const colors: Record<string, Color> = {}

    const buttonStatesSet: Map<string, Partial<ButtonState>> = new Map()
    const inputStatesSet: Map<string, Partial<InputState>> = new Map()

    walk(nodes, (node: Node) => {
      if (buttonFrameIds.includes(node.name) && 'children' in node) {
        node.children.forEach((button) => {
          const properties: Array<string> = button.name
            .split(',')
            .map((name: string) => name.trim())

          const style = this.findPropertyValue(properties, STYLE_KEY)
          const state = this.findPropertyValue(properties, STATE_KEY)
          const text = this.findPropertyValue(properties, TEXT_KEY)

          if (!('children' in button) || !style || !state || !text || text === 'false') {
            return
          }

          const buttonState = buttonStatesSet.get(this.formatString(style))
          const formattedStyle = this.formatString(style)
          const formattedState = this.formatString(state) as keyof typeof buttonState

          if (buttonState?.[formattedState]) return

          buttonStatesSet.set(formattedStyle, {
            ...buttonState,
            [formattedState]: this.getStateColors(button),
          })
        })
      }

      if (inputFrameIds.includes(node.name) && 'children' in node) {
        node.children.forEach((input) => {
          const properties: Array<string> = input.name.split(',').map((name: string) => name.trim())

          const type = this.findPropertyValue(properties, TYPE_KEY)
          const state = this.findPropertyValue(properties, STATE_KEY)

          if (!('children' in input) || !type || !state) {
            return
          }

          const formattedType = this.formatString(type)
          const formattedState = this.formatString(state)

          const inputState = inputStatesSet.get(formattedType)
          const inputField = input.children.find((item) => item.name === INPUT_FIELD_KEY)
          if (!inputField) return

          inputStatesSet.set(formattedType, {
            ...inputState,
            [formattedState]: this.getStateColors(inputField),
          })
        })
      }

      if ('color' in node && node.color && isColor(node.color)) {
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

  getColors(nodes: ReadonlyArray<Node>): object {
    const colors: Record<string, Color> = {}
    const buttonNames: Array<string> = []
    const buttonStates: Array<ButtonState> = []
    const inputStates: Array<InputState> = []
    const inputNames: Array<string> = []

    walk(nodes, (node: Node) => {
      if (buttonFrameIds.includes(node.name) && 'children' in node) {
        const names = node.children.map((buttonName) => buttonName.name)

        node.children.forEach((item) => {
          if (!('children' in item)) {
            return
          }

          const obj = {
            name: item.name,
            default: item.children[0],
            hover: item.children[1],
            pressed: item.children[2] !== undefined ? item.children[2] : item.children[0],
            disabled: item.children[3] !== undefined ? item.children[3] : item.children[0],
          }

          buttonStates.push({
            default: this.getStateColors(obj.default),
            hover: this.getStateColors(obj.hover),
            pressed: this.getStateColors(obj.pressed),
            disabled: this.getStateColors(obj.disabled),
          })
        })

        names.forEach((buttonName: string) => {
          if (buttonName) {
            buttonNames.push(this.formatString(buttonName))
          }
        })
      }

      if (inputFrameIds.includes(node.name) && 'children' in node) {
        const names = node.children.map((inputName) => inputName.name)

        node.children.forEach((item) => {
          if (!('children' in item)) {
            return
          }

          const obj = {
            name: item.name,
            default: item.children[0],
            active: item.children[1],
            error: item.children[2],
            focus: item.children[3],
            disabled: item.children[4] !== undefined ? item.children[4] : item.children[0],
          }

          inputStates.push({
            default: this.getStateColors(obj.default),
            active: this.getStateColors(obj.active),
            error: this.getStateColors(obj.error),
            focus: this.getStateColors(obj.focus),
            disabled: this.getStateColors(obj.disabled),
          })
        })

        names.forEach((inputName: string) => {
          if (inputName) {
            inputNames.push(this.formatString(inputName))
          }
        })
      }

      if ('color' in node && node.color && isColor(node.color)) {
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
