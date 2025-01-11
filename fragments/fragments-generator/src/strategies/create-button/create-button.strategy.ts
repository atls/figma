import type { Instance }            from 'figma-js'
import type { ReactElement }        from 'react'

import type { ComponentProperties } from '../strategies.interfaces.js'

import { Fragment }                 from 'react'
import { createElement }            from 'react'

export class CreateButtonStrategy {
  getImports(): Array<string> {
    return [`import { Button } from '@ui/button'`]
  }

  createElement(node: Instance): ReactElement {
    if ('componentProperties' in node) {
      const style = (node.componentProperties as ComponentProperties).Style

      return createElement('Button', { variant: style?.value.toString().toLocaleLowerCase() })
    }

    return createElement(Fragment)
  }
}
