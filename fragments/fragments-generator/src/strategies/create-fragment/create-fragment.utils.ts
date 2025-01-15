import type { Node }         from 'figma-js'
import type { Instance }     from 'figma-js'
import type { Frame }        from 'figma-js'
import type { Group }        from 'figma-js'
import type { Component }    from 'figma-js'
import type { ComponentSet } from 'figma-js'

import { isInstance }        from '@atls/figma-utils'

export const isIcon = (node: Node): node is Instance =>
  isInstance(node) && node.children.some((item) => item.type === 'VECTOR')

export const isButton = (node: Node): node is Instance =>
  isInstance(node) && node.name.toLowerCase().includes('button')

export const isInput = (node: Node): node is Instance =>
  isInstance(node) && node.name.toLowerCase().includes('input')

export const nodeHasImage = (
  node: Node
): node is Component | ComponentSet | Frame | Group | Instance =>
  'background' in node && node.background.some((item) => item.type === 'IMAGE')
