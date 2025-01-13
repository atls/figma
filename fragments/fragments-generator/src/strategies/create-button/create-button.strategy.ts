import type { Instance }            from 'figma-js'
import type { ReactElement }        from 'react'

import type { ComponentProperties } from '../strategies.interfaces.js'

import { Fragment }                 from 'react'
import React                        from 'react'

export class CreateButtonStrategy {
  getImports(): Array<string> {
    return [`import { Button } from '@ui/button'`]
  }

  createElement(node: Instance): ReactElement {
    if (!('componentProperties' in node)) {
      return React.createElement(Fragment)
    }

    const style = (node.componentProperties as ComponentProperties).Style

    if (!style) {
      return React.createElement(Fragment)
    }

    return React.createElement('Button', { variant: style?.value.toString().toLocaleLowerCase() })
  }
}
