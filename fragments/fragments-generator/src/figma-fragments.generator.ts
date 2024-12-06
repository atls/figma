import { FileNodesResponse }     from 'figma-js'

import { SimpleMappingStrategy } from './strategy/index.js'

export class FigmaThemeFragmentsGenerator {
  readonly name = 'fragments'

  createComponent(fragment: string): string {
    return `
      import React from 'react'
      import { memo } from 'react'
        
      export const GeneratedFragment = memo(() => (${fragment}))`
  }

  generate(response: FileNodesResponse, theme: Record<string, Record<string, string>>): string {
    const strategy = new SimpleMappingStrategy(theme)

    const fragment = strategy.execute(response.nodes)

    return this.createComponent(fragment)
  }
}
