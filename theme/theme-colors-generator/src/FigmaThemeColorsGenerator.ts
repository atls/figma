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

import { ButtonState }               from './Interfaces'

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  readonly buttonFrameId = 'Desktop / Buttons'

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
    const buttonNames: string[] = []
    const buttonStates: ButtonState[] = []

    walk(nodes, (node) => {
      const { name } = node

      if (name?.match(this.buttonFrameId)) {
        const names = node.children.map((buttonName) => buttonName.name)

        const buttons = node.children
          .map((item) => {
            const obj = {
              name: item.name,
              default: item.children[0],
              hover: item.children[1],
              pressed: item.children[2] !== undefined ? item.children[2] : item.children[0],
              disabled: item.children[3] !== undefined ? item.children[3] : item.children[0],
            }

            const fontDefault = obj.default.children.find((child) => child.type === 'TEXT')
            const fontColorDefault = fontDefault
              ? this.getColor(fontDefault)
              : 'rgba(0, 0, 0, 0.00)'

            const backgroundColorDefault = toColorString(obj.default.backgroundColor)
            const borderColorDefault =
              obj.default.strokes[0]?.color !== undefined
                ? toColorOpacityString(
                    obj.default.strokes[0].color,
                    obj.default.strokes[0]?.opacity
                  )
                : 'rgba(0, 0, 0, 0.00)'

            const fontHover = obj.hover?.children?.find((child) => child.type === 'TEXT')
            const fontColorHover = fontHover ? this.getColor(fontHover) : 'rgba(0, 0, 0, 0.00)'

            const backgroundColorHover = obj.hover?.backgroundColor
              ? toColorString(obj.hover.backgroundColor)
              : 'rgba(0, 0, 0, 0.00)'
            const borderColorHover =
              obj.hover.strokes[0]?.color !== undefined
                ? toColorOpacityString(obj.hover.strokes[0].color, obj.hover.strokes[0]?.opacity)
                : 'rgba(0, 0, 0, 0.00)'

            const fontPressed = obj.pressed?.children?.find((child) => child.type === 'TEXT')
            const fontColorPressed = fontPressed
              ? this.getColor(fontPressed)
              : 'rgba(0, 0, 0, 0.00)'

            const backgroundColorPressed = toColorString(obj.pressed.backgroundColor)
            const borderColorPressed =
              obj.pressed.strokes[0]?.color !== undefined
                ? toColorOpacityString(
                    obj.pressed.strokes[0].color,
                    obj.pressed.strokes[0]?.opacity
                  )
                : 'rgba(0, 0, 0, 0.00)'

            const fontDisabled = obj.disabled?.children?.find((child) => child.type === 'TEXT')
            const fontColorDisabled = fontDisabled
              ? this.getColor(fontDisabled)
              : 'rgba(0, 0, 0, 0.00)'

            const backgroundColorDisabled = toColorString(obj.disabled.backgroundColor)
            const borderColorDisabled =
              obj.disabled.strokes[0]?.color !== undefined
                ? toColorOpacityString(
                    obj.disabled.strokes[0].color,
                    obj.disabled.strokes[0]?.opacity
                  )
                : 'rgba(0, 0, 0, 0.00)'

            return {
              default: {
                background: backgroundColorDefault,
                font: fontColorDefault,
                border: borderColorDefault,
              },
              hover: {
                background: backgroundColorHover,
                font: fontColorHover,
                border: borderColorHover,
              },
              pressed: {
                background: backgroundColorPressed,
                font: fontColorPressed,
                border: borderColorPressed,
              },
              disabled: {
                background: backgroundColorDisabled,
                font: fontColorDisabled,
                border: borderColorDisabled,
              },
            }
          })
          .flat()
          .filter((item) => item !== undefined)

        buttonStates.push(...buttons)

        names.map((buttonName: string) => {
          if (buttonName !== undefined) {
            const trimItem = this.formatString(buttonName)

            buttonNames.push(trimItem)
          }

          return []
        })
      }

      if (node.color && isColor(node.color)) {
        // node fills
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

    return Object.keys(buttonColorsResult).length
      ? {
          ...colorsResult,
          button: {
            ...buttonColorsResult,
          },
        }
      : {
          ...colorsResult,
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
