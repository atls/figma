import { FileNodesResponse }      from 'figma-js'

import { CreateFragmentStrategy } from './strategy/index.js'

export class FigmaThemeFragmentsGenerator {
  readonly name = 'fragments'

  createComponent(fragment: string, imports?: Array<string>): string {
    return `
      import React from 'react'
      import { memo } from 'react'
      ${imports?.join('\n')}
        
      export const GeneratedFragment = memo(() => (${fragment}))`
  }

  generate(response: FileNodesResponse, theme: Record<string, Record<string, string>>): string {
    const strategy = new CreateFragmentStrategy(theme)

    const { fragment, imports } = strategy.execute(response.nodes)

    return this.createComponent(fragment, imports)
  }
}
