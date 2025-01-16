import type { Instance }            from 'figma-js'
import type { ReactElement }        from 'react'

import type { ComponentProperties } from '../strategies.interfaces.js'

import React                        from 'react'

export class CreateLinkStrategy {
  getImports(): Array<string> {
    return [`import { Link } from '@ui/link'`]
  }

  createElement(node: Instance): ReactElement {
    let variant: string | undefined

    if ('componentProperties' in node) {
      const style = (node.componentProperties as ComponentProperties).Style

      variant = style?.value?.toString().toLocaleLowerCase()
    }

    return React.createElement('Link', { variant, href: node.name })
  }
}
