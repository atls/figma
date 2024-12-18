import { FileNodesResponse }      from 'figma-js'

import { CreateFragmentStrategy } from './strategies/index.js'

export class FigmaThemeFragmentsGenerator {
  readonly name = 'fragments'

  createComponent(fragment: string, name: string, imports?: Array<string>): string {
    return `
      import React from 'react'
      import { memo } from 'react'
      ${imports?.join('\n')}
        
      export const ${name} = memo(() => (${fragment}))
      
      ${name}.displayName = '${name}'
      `
  }

  generate(
    response: FileNodesResponse,
    theme: Record<string, Record<string, string>>,
    name: string
  ): string {
    const strategy = new CreateFragmentStrategy(theme)

    const { fragment, imports } = strategy.execute(response.nodes)

    return this.createComponent(fragment, name, imports)
  }
}
