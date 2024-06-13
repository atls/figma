import { toColorOpacityString } from '@atls/figma-utils'
import { toColorString }        from '@atls/figma-utils'

interface InputState {
  default: StateColors
  active: StateColors
  error: StateColors
  focus: StateColors
  disabled: StateColors
}

interface StateColors {
  background: string
  font: string
  border: string
}

export function getInputStates(
  nodes,
  frameId: string,
  getColor: (obj: any) => string,
  formatString: (str: string) => string
) {
  const inputStates: InputState[] = []
  const inputNames: string[] = []

  nodes.forEach((node) => {
    const { name } = node
    if (name?.match(frameId)) {
      const names = node.children.map((inputName) => inputName.name)

      const inputs = node.children
        .map((item) => {
          const obj = {
            name: item.name,
            default: item.children[0],
            active: item.children[1],
            error: item.children[2],
            focus: item.children[3],
            disabled: item.children[4] !== undefined ? item.children[4] : item.children[0],
          }

          const fontDefault = obj.default.children.find((child) => child.type === 'TEXT')
          const fontColorDefault = fontDefault ? getColor(fontDefault) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorDefault = toColorString(obj.default.backgroundColor)
          const borderColorDefault =
            obj.default.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.default.strokes[0].color, obj.default.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)'

          const fontActive = obj.active?.children?.find((child) => child.type === 'TEXT')
          const fontColorActive = fontActive ? getColor(fontActive) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorActive = obj.active?.backgroundColor
            ? toColorString(obj.active.backgroundColor)
            : 'rgba(0, 0, 0, 0.00)'
          const borderColorActive =
            obj.active.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.active.strokes[0].color, obj.active.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)'

          const fontError = obj.error?.children?.find((child) => child.type === 'TEXT')
          const fontColorError = fontError ? getColor(fontError) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorError = obj.error?.backgroundColor
            ? toColorString(obj.error.backgroundColor)
            : 'rgba(0, 0, 0, 0.00)'
          const borderColorError =
            obj.error?.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.error.strokes[0].color, obj.error.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)'

          const fontFocus = obj.focus?.children?.find((child) => child.type === 'TEXT')
          const fontColorFocus = fontFocus ? getColor(fontFocus) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorFocus = obj.focus?.backgroundColor
            ? toColorString(obj.focus.backgroundColor)
            : 'rgba(0, 0, 0, 0.00)'
          const borderColorFocus =
            obj.focus?.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.focus.strokes[0].color, obj.focus.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)'

          const fontDisabled = obj.disabled?.children?.find((child) => child.type === 'TEXT')
          const fontColorDisabled = fontDisabled ? getColor(fontDisabled) : 'rgba(0, 0, 0, 0.00)'

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
            active: {
              background: backgroundColorActive,
              font: fontColorActive,
              border: borderColorActive,
            },
            error: {
              background: backgroundColorError,
              font: fontColorError,
              border: borderColorError,
            },
            focus: {
              background: backgroundColorFocus,
              font: fontColorFocus,
              border: borderColorFocus,
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

      inputStates.push(...inputs)

      names.forEach((inputName: string) => {
        if (inputName !== undefined) {
          const trimItem = formatString(inputName)
          inputNames.push(trimItem)
        }
      })
    }
  })

  return { inputNames, inputStates }
}
