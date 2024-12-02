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

  generate(response: FileNodesResponse): string {
    const strategy = new SimpleMappingStrategy()

    const textNodes = this.getTextNodes(response.nodes)

    const component = strategy.execute(textNodes)

    return component
  }
}
