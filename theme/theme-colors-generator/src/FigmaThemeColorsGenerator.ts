import { FileResponse }              from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { isColor }                   from '@atls/figma-utils'
import { toColorOpacityString }      from '@atls/figma-utils'
import { toAverage }                 from '@atls/figma-utils'
import { toColorName }               from '@atls/figma-utils'
import { toColorString }             from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

interface ButtonState {
  default: {
    background: string
    font: string
    border: string
  }
  hover: {
    background: string
    font: string
    border: string
  }
  pressed: {
    background: string
    font: string
    border: string
  }
  disabled: {
    background: string
    font: string
    border: string
  }
}

export class FigmaThemeColorsGenerator extends FigmaThemeGenerator {
  readonly name = 'colors'

  formattedString(str: string): string {
    const clearString = str.replace(/[^a-zа-яё0-9]/gi, ' ')

    return clearString
      .split(' ')
      .map((str, index) =>
        index === 0
          ? str.charAt(0).toLowerCase() + str.slice(1)
          : str.charAt(0).toUpperCase() + str.slice(1))
      .join('')
  }

  convertColor(obj) {
    if (obj.type === 'TEXT' || obj.type === 'VECTOR') return ''
    if (obj.type === 'INSTANCE') return toColorString(obj.children[0].fills[0].color)
  }

  getColors(nodes) {
    const colors = {}
    const buttonNames: string[] = []
    const buttonStates: ButtonState[] = []

    walk(nodes, (node) => {
      const { name } = node

      if (name?.match('Desktop/ Buttons')) {
        const names = node.children.map((item) => item.children?.map((item) => item.name))

        const result = node.children
          .map((child) => {
            return child.children?.map((item) => {
              const obj = {
                name: item.name,
                default: item.children[0],
                hover: item.children[1],
                pressed: item.children[2] !== undefined ? item.children[2] : item.children[0],
                disabled: item.children[3] !== undefined ? item.children[3] : item.children[0],
              }

              const fontColorDefault = obj.default.children.map((style) =>
                this.convertColor(style))[0]
              const backgroundColorDefault = toColorString(obj.default.backgroundColor)
              const borderColorDefault =
                obj.default.strokes[0]?.color !== undefined
                  ? toColorOpacityString(
                      obj.default.strokes[0].color,
                      obj.default.strokes[0]?.opacity
                    )
                  : 'rgba(0, 0, 0, 0.00)'

              const fontColorHover = obj.hover.children.map((style) => this.convertColor(style))[0]
              const backgroundColorHover = toColorString(obj.hover.backgroundColor)
              const borderColorHover =
                obj.hover.strokes[0]?.color !== undefined
                  ? toColorOpacityString(obj.hover.strokes[0].color, obj.hover.strokes[0]?.opacity)
                  : 'rgba(0, 0, 0, 0.00)'

              const fontColorPressed = obj.pressed.children.map((style) =>
                this.convertColor(style))[0]
              const backgroundColorPressed = toColorString(obj.pressed.backgroundColor)
              const borderColorPressed =
                obj.pressed.strokes[0]?.color !== undefined
                  ? toColorOpacityString(
                      obj.pressed.strokes[0].color,
                      obj.pressed.strokes[0]?.opacity
                    )
                  : 'rgba(0, 0, 0, 0.00)'

              const fontColorDisabled = obj.disabled.children.map((style) =>
                this.convertColor(style))[0]
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
          })
          .flat()
          .filter((item) => item !== undefined)

        buttonStates.push(...result)

        names.map((item: string[]) => {
          if (item !== undefined) {
            const trimItem = item.map((item) => this.formattedString(item))

            buttonNames.push(...trimItem)
          }
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
      (result, color, index) => ({
        ...result,
        [color]: buttonStates[index],
      }),
      {}
    )

    return {
      ...colorsResult,
      button: {
        ...buttonColorsResult,
      },
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
