import type { Color as NamerColor } from 'color-namer'
import type { Palette }             from 'color-namer'
import type { Color }               from 'figma-js'

import namer                        from 'color-namer'

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const isColor = (node: any): node is Color => node.r && node.g && node.b && node.a

export const toAverage = (node: Color): number => ((node.r + node.g + node.b) / 3) * node.a

export const normalizeChannel = (num: number): number => Math.round(num * 255)

export const clearStringOfSpecialChars = (str: string): string =>
  str.replace(/[^a-zа-яё0-9]/gi, ' ')

export const toColorString = (node: Color): string => {
  const r = normalizeChannel(node.r)
  const g = normalizeChannel(node.g)
  const b = normalizeChannel(node.b)

  return `rgba(${r}, ${g}, ${b}, ${node.a === 1 ? 1 : node.a.toFixed(2)})`
}

export const toColorOpacityString = (node: Color, opacity: number): string => {
  const r = normalizeChannel(node.r)
  const g = normalizeChannel(node.g)
  const b = normalizeChannel(node.b)

  return `rgba(${r}, ${g}, ${b}, ${opacity ? opacity.toFixed(2) : 1})`
}

const namespaces: Array<Palette> = ['basic', 'html', 'pantone', 'ntc', 'x11', 'roygbiv']

const formatColorName = (name: string): string => name.replace(/ /g, '').toLowerCase()

export const toColorName = (color: string, skip: Array<string> = []): string => {
  try {
    const names: Record<Palette, Array<NamerColor>> = namer(color)

    const [appropriate] = namespaces
      .map((namespace) => {
        const [item] = names[namespace].filter(
          (current: NamerColor) => !skip.includes(formatColorName(current.name))
        )

        return item
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)

    if (appropriate) {
      return formatColorName(appropriate.name)
    }

    return color
  } catch {
    return color
  }
}
