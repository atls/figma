import { Instance }            from 'figma-js'
import { Text }                from 'figma-js'
import { Fragment }            from 'react'
import { createElement }       from 'react'

import { isFrame }             from '@atls/figma-utils'
import { isText }              from '@atls/figma-utils'

import { ComponentProperties } from './strategy.interfaces.js'

export class CreateInputStrategy {
  getImports() {
    return [`import { Input } from '@ui/input'`]
  }

  createElement(node: Instance) {
    if ('componentProperties' in node) {
      const type = (node.componentProperties as ComponentProperties).Type
      const field = node.children.find((child) => child.name?.toLocaleLowerCase() === 'field')

      let placeholder: string | undefined

      if (field && isFrame(field)) {
        const textNode = field.children.find((child) => isText(child)) as Text | undefined

        placeholder = textNode ? textNode.characters : undefined
      }

      return createElement('Input', {
        variant: type?.value.toString().toLocaleLowerCase(),
        placeholder,
      })
    }

    return createElement(Fragment)
  }
}
