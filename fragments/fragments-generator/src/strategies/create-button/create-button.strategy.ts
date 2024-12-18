import type { Instance }       from 'figma-js'

import { Fragment }            from 'react'
import { createElement }       from 'react'

import { ComponentProperties } from '../strategies.interfaces.js'

export class CreateButtonStrategy {
  getImports() {
    return [`import { Button } from '@ui/button'`]
  }

  createElement(node: Instance) {
    if ('componentProperties' in node) {
      const style = (node.componentProperties as ComponentProperties).Style

      return createElement('Button', { variant: style?.value.toString().toLocaleLowerCase() })
    }

    return createElement(Fragment)
  }
}
