import { FileNodesResponse }     from 'figma-js'
import { Text }                  from 'figma-js'

import { isText }                from '@atls/figma-utils'
import { walk }                  from '@atls/figma-utils'

import { SimpleMappingStrategy } from './strategy/index.js'

export class FigmaThemeFragmentsGenerator {
  readonly name = 'fragments'

  getTextNodes(nodes): Text[] {
    const textNodes: Text[] = []

    walk(nodes, (node) => {
      if (isText(node)) {
        textNodes.push(node)
      }
    })

    return textNodes
  }

  createComponent(fragment: string): string {
    return `
      import React from 'react'
      import { memo } from 'react'
        
      export const GeneratedFragment = memo(() => (${fragment}))`
  }

  generate(response: FileNodesResponse, theme: Record<string, Record<string, string>>): string {
    const strategy = new SimpleMappingStrategy(theme)

    const textNodes = this.getTextNodes(response.nodes)

    const fragment = strategy.execute(textNodes)

    return this.createComponent(fragment)
  }
}
