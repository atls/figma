import type { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import type { FileResponse }              from 'figma-js'
import type { Text }                      from 'figma-js'
import type { Node }                      from 'figma-js'

import { FigmaThemeGenerator }            from '@atls/figma-theme-generator-common'
import { isText }                         from '@atls/figma-utils'
import { walk }                           from '@atls/figma-utils'

import { SimpleMappingStrategy }          from './strategy/index.js'

export class FigmaThemeLineHeightsGenerator extends FigmaThemeGenerator {
  readonly name = 'lineHeights'

  getLineHeight(nodes: ReadonlyArray<Node>): Array<Text> {
    const textNodes: Array<Text> = []

    walk(nodes, (node: Node) => {
      if (isText(node)) {
        textNodes.push(node)
      }
    })

    return textNodes
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const strategy = new SimpleMappingStrategy()

    const values = strategy.execute(this.getLineHeight(file.document.children))

    return {
      name: this.name,
      content: this.exportValuesTemplate('lineHeights', values),
    }
  }
}
