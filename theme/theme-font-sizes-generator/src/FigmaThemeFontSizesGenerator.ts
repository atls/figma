import { FileResponse, Text } from 'figma-js'
import { walk, isText } from '@atls/figma-utils'
import {
  FigmaThemeGenerator,
  FigmaThemeGeneratorResult,
} from '@atls/figma-theme-generator-common'
import { SimpleMappingStrategy } from './strategy'

export class FigmaThemeFontSizesGenerator extends FigmaThemeGenerator {
  readonly name = 'fontSizes'

  getFontSizes(nodes): Text[] {
    const textNodes: Text[] = []

    walk(nodes, node => {
      if (isText(node)) {
        textNodes.push(node)
      }
    })

    return textNodes
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const strategy = new SimpleMappingStrategy()

    const values = strategy.execute(this.getFontSizes(file.document.children))

    return {
      name: 'fontSizes',
      content: this.exportValuesTemplate('fontSizes', values),
    }
  }
}
