import { toColorOpacityString } from '@atls/figma-utils'
import { toColorString }        from '@atls/figma-utils'

interface ButtonState {
  default: StateColors
  hover: StateColors
  pressed: StateColors
  disabled: StateColors
}

interface StateColors {
  background: string
  font: string
  border: string
}

export function getButtonStates(
  nodes,
  frameId: string,
  getColor: (obj: any) => string,
  formatString: (str: string) => string
) {
  const buttonStates: ButtonState[] = []
  const buttonNames: string[] = []

  nodes.forEach((node) => {
    const { name } = node
    if (name?.match(frameId)) {
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
          const fontColorDefault = fontDefault ? getColor(fontDefault) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorDefault = toColorString(obj.default.backgroundColor)
          const borderColorDefault =
            obj.default.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.default.strokes[0].color, obj.default.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)'

          const fontHover = obj.hover?.children?.find((child) => child.type === 'TEXT')
          const fontColorHover = fontHover ? getColor(fontHover) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorHover = obj.hover?.backgroundColor
            ? toColorString(obj.hover.backgroundColor)
            : 'rgba(0, 0, 0, 0.00)'
          const borderColorHover =
            obj.hover.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.hover.strokes[0].color, obj.hover.strokes[0]?.opacity)
              : 'rgba(0, 0, 0, 0.00)'

          const fontPressed = obj.pressed?.children?.find((child) => child.type === 'TEXT')
          const fontColorPressed = fontPressed ? getColor(fontPressed) : 'rgba(0, 0, 0, 0.00)'

          const backgroundColorPressed = toColorString(obj.pressed.backgroundColor)
          const borderColorPressed =
            obj.pressed.strokes[0]?.color !== undefined
              ? toColorOpacityString(obj.pressed.strokes[0].color, obj.pressed.strokes[0]?.opacity)
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

      names.forEach((buttonName: string) => {
        if (buttonName !== undefined) {
          const trimItem = formatString(buttonName)
          buttonNames.push(trimItem)
        }
      })
    }
  })

  return { buttonNames, buttonStates }
}
