import type { FigmaThemeGeneratorResult } from '@atls/figma-theme-generator-common'
import type { FileResponse }              from 'figma-js'
import type { Node }                      from 'figma-js'

import { FigmaThemeGenerator }            from '@atls/figma-theme-generator-common'

import { SimpleMappingStrategy }          from './strategy/index.js'

export class FigmaThemeRadiiGenerator extends FigmaThemeGenerator {
  readonly name = 'radii'

  getRadii(nodes: ReadonlyArray<Node>): object {
    const strategy = new SimpleMappingStrategy()

    return strategy.execute(nodes)
  }

  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const values = this.getRadii(file.document.children)

    return {
      name: this.name,
      content: this.exportValuesTemplate('radii', values),
    }
  }
}
