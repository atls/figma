import { Node }     from 'figma-js'
import { Text }     from 'figma-js'
import { Frame }    from 'figma-js'
import { Instance } from 'figma-js'

const isEmpty = (node: any) => !node || Object.keys(node).length === 0

export const isText = (node: Node): node is Text => node.type === 'TEXT'

export const isFrame = (node: Node): node is Frame => node.type === 'FRAME'

export const isInstance = (node: Node): node is Instance => node.type === 'INSTANCE'

export const walk = (targetNode: any, cb: (node: any) => any) => {
  if (isEmpty(targetNode) || typeof targetNode === 'string' || typeof targetNode === 'number') {
    return
  }

  cb(targetNode)

  if (Array.isArray(targetNode)) {
    targetNode.forEach((el) => walk(el, cb))
  } else {
    Object.values(targetNode).forEach((v) => walk(v, cb))
  }
}
