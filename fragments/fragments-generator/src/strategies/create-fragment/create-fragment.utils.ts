import type { Node }     from 'figma-js'
import type { Instance } from 'figma-js'

import { isInstance }    from '@atls/figma-utils'

export const isIcon = (node: Node): node is Instance =>
  isInstance(node) && node.children.some((item) => item.type === 'VECTOR')

export const isButton = (node: Node): node is Instance =>
  isInstance(node) && node.name.toLowerCase().includes('button')

export const isInput = (node: Node): node is Instance =>
  isInstance(node) && node.name.toLowerCase().includes('input')
