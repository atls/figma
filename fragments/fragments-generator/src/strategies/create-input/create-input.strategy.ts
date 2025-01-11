import type { Instance }            from 'figma-js'
import type { ReactElement }        from 'react'

import type { ComponentProperties } from '../strategies.interfaces.js'

import { Fragment }                 from 'react'
import { createElement }            from 'react'

import { isFrame }                  from '@atls/figma-utils'
import { isText }                   from '@atls/figma-utils'

export class CreateInputStrategy {
  getImports(): Array<string> {
    return [`import { Input } from '@ui/input'`]
  }

  createElement(node: Instance): ReactElement {
    if ('componentProperties' in node) {
      const type = (node.componentProperties as ComponentProperties).Type
      const field = node.children.find((child) => child.name?.toLocaleLowerCase() === 'field')

      let placeholder: string | undefined

      if (field && isFrame(field)) {
        const textNode = field.children.find((child) => isText(child))

        placeholder = textNode && isText(textNode) ? textNode.characters : undefined
      }

      return createElement('Input', {
        variant: type?.value.toString().toLocaleLowerCase(),
        placeholder,
      })
    }

    return createElement(Fragment)
  }
}
