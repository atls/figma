import { Instance }            from 'figma-js'
import { Fragment }            from 'react'
import { createElement }       from 'react'

import { ComponentProperties } from './strategy.interfaces.js'

export class CreateInputStrategy {
  getImports() {
    return [`import { Input } from '@ui/input'`]
  }

  createElement(node: Instance) {
    if ('componentProperties' in node) {
      const style = (node.componentProperties as ComponentProperties).Style

      return createElement('Input', { variant: style?.value.toString().toLocaleLowerCase() })
    }

    return createElement(Fragment)
  }
}
