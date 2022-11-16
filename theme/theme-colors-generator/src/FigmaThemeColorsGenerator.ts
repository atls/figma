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

  getColors(nodes) {
    const colors = {}
    const buttonNames: string[] = []

    walk(nodes, (node) => {
      const name = node.name

      if (Boolean(name?.match('Desktop/ Buttons'))) {
        const items = node.children.map((item) => item.children?.map((item) => item.name))

        const res = node.children.map((item) => {
          return item.children?.map((item) => {
            if (item.name === 'Primary / Main') {
              return {
                default: item.children?.map(item => item)[0],
                hover: item.children?.map(item => item)[1],
                pressed: item.children?.map(item => item)[2],
                disabled: item.children?.map(item => item)[3]
              }
            }
          })
        })[1]

        console.log(res[0].default)

        items.map((item: string[]) => {
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
      (result, color) => ({
        ...result,
        [color]: {
          default: {
            background: '',
            font: '',
            border: '',
          },
          hover: {
            background: '',
            font: '',
            border: '',
          },
          pressed: {
            background: '',
            font: '',
            border: '',
          },
          disabled: {
            background: '',
            font: '',
            border: '',
          },
        },
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
