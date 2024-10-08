import { FileResponse }              from 'figma-js'
import { Text }                      from 'figma-js'

import { FigmaThemeGenerator }       from '@atls/figma-theme-generator-common'
import { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import { isText }                    from '@atls/figma-utils'
import { walk }                      from '@atls/figma-utils'

import { SimpleMappingStrategy }     from './strategy/index.js'

export class FigmaThemeFontsGenerator extends FigmaThemeGenerator {
  readonly name = 'fonts'

  getFonts(nodes): Text[] {
    const textNodes: Text[] = []

    walk(nodes, (node) => {
      if (isText(node)) {
        textNodes.push(node)
      }
    })

    return textNodes
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const strategy = new SimpleMappingStrategy()

    const values = strategy.execute(this.getFonts(file.document.children))

    return {
      name: this.name,
      content: this.exportValuesTemplate('fonts', values),
    }
  }
}
