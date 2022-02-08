import { Color } from 'figma-js'
import namer from 'color-namer'

export const isColor = (node: any): node is Color =>
  node.r && node.g && node.b && node.a

export const toAverage = (node: Color) =>
  ((node.r + node.g + node.b) / 3) * node.a

export const normalizeChannel = (num: number) => Math.floor(num * 255)

export const toColorString = (node: Color) => {
  const r = normalizeChannel(node.r)
  const g = normalizeChannel(node.g)
  const b = normalizeChannel(node.b)

  if (node.a === 1) {
    return `rgb(${r}, ${g}, ${b})`
  }

  return `rgba(${r}, ${g}, ${b}, ${node.a.toFixed(2)})`
}

const namespaces = ['basic', 'html', 'pantone', 'ntc', 'x11', 'roygbiv']

const formatColorName = (name: string) => name.replace(/ /g, '').toLowerCase()

export const toColorName = (color: string, skip: string[] = []): string => {
  try {
    const names = namer(color)

    const [appropriate] = namespaces
      .map(namespace => {
        const [item] = names[namespace].filter(
          current => !skip.includes(formatColorName(current.name))
        )

        return item
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)

    if (appropriate) {
      return formatColorName(appropriate.name)
    }

    return color
  } catch (error) {
    return color
  }
}
