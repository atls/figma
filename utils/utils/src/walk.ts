import type { Node }     from 'figma-js'
import type { Text }     from 'figma-js'
import type { Frame }    from 'figma-js'
import type { Instance } from 'figma-js'

export const isText = (node: Node): node is Text => node.type === 'TEXT'

export const isFrame = (node: Node): node is Frame => node.type === 'FRAME'

export const isInstance = (node: Node): node is Instance => node.type === 'INSTANCE'

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const walk = (targetNode: any, cb: (node: any) => any): void => {
  if (
    !targetNode ||
    Object.keys(targetNode as object).length === 0 ||
    typeof targetNode === 'string' ||
    typeof targetNode === 'number'
  ) {
    return
  }

  cb(targetNode)

  if (Array.isArray(targetNode)) {
    targetNode.forEach((el): void => {
      walk(el, cb)
    })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.values(targetNode).forEach((v): void => {
      walk(v, cb)
    })
  }
}
