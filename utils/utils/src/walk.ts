import { Text, Node } from 'figma-js'

const isEmpty = (node: any) => !node || Object.keys(node).length === 0

export const isText = (node: Node): node is Text => node.type === 'TEXT'

export const walk = (node: any, cb: (node: any) => any) => {
  if (isEmpty(node) || typeof node === 'string' || typeof node === 'number') {
    return
  }

  cb(node)

  if (Array.isArray(node)) {
    node.forEach(el => walk(el, cb))
  } else {
    Object.values(node).forEach(v => walk(v, cb))
  }
}
