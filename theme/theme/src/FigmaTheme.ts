import type { FigmaThemeGeneratorValues } from '@atls/figma-theme-generator-common'
import type { FileResponse }              from 'figma-js'
import type { Node }                      from 'figma-js'

import { promises as fs }                 from 'fs'
import path                               from 'path'
import prettier                           from 'prettier'

import { FigmaThemeBordersGenerator }     from '@atls/figma-theme-borders-generator'
import { FigmaThemeColorsGenerator }      from '@atls/figma-theme-colors-generator'
import { FigmaThemeFontSizesGenerator }   from '@atls/figma-theme-font-sizes-generator'
import { FigmaThemeFontWeightsGenerator } from '@atls/figma-theme-font-weights-generator'
import { FigmaThemeFontsGenerator }       from '@atls/figma-theme-fonts-generator'
import { FigmaThemeLineHeightsGenerator } from '@atls/figma-theme-line-heights-generator'
import { FigmaThemeRadiiGenerator }       from '@atls/figma-theme-radii-generator'
import { FigmaThemeShadowsGenerator }     from '@atls/figma-theme-shadows-generator'
import { walk }                           from '@atls/figma-utils'

const generators = [
  FigmaThemeBordersGenerator,
  FigmaThemeColorsGenerator,
  FigmaThemeFontSizesGenerator,
  FigmaThemeFontWeightsGenerator,
  FigmaThemeFontsGenerator,
  FigmaThemeLineHeightsGenerator,
  FigmaThemeRadiiGenerator,
  FigmaThemeShadowsGenerator,
]

export class FigmaTheme {
  file: FileResponse

  output: string

  ignoredPages: Array<string>

  includedPages: Array<string>

  prefix: string

  method: 'default' | 'secondary'

  constructor(
    file: FileResponse,
    output: string = 'theme',
    ignoredPages: Array<string> = [],
    includedPages: Array<string> = [],
    prefix: string = '',
    method: 'default' | 'secondary' = 'default'
  ) {
    this.file = file

    this.output = path.join(process.cwd(), output)

    this.ignoredPages = ignoredPages
    this.includedPages = includedPages
    this.prefix = prefix
    this.method = method === 'secondary' ? method : 'default'
  }

  async format(target: string, content: string): Promise<string> {
    const options = await prettier.resolveConfig(target)

    return prettier.format(content, { ...options })
  }

  async write({ name, content }: FigmaThemeGeneratorValues): Promise<void> {
    const target = path.join(this.output, `${name}.ts`)

    const data = await this.format(target, content)

    await fs.writeFile(target, data)
  }

  async generate(): Promise<Array<void>> {
    const filteredPages = this.file.document.children.filter((node) => {
      const isCanvas = node.type === 'CANVAS'
      const isNotIgnored = !this.ignoredPages.includes(node.id)
      const isIncluded = this.includedPages.length === 0 || this.includedPages.includes(node.id)
      return isCanvas && isNotIgnored && isIncluded
    })

    const componentNodes = this.prefix
      ? this.getComponentsWithPrefix(filteredPages, this.prefix)
      : filteredPages

    const fileData = {
      ...this.file,
      document: {
        ...this.file.document,
        children: componentNodes,
      },
    }

    return Promise.all(
      generators.map(async (Generator) => {
        const instance = new Generator(this.method)
        const result = await Promise.resolve(instance.generate(fileData))
        await this.write(result)
      })
    )
  }

  private getComponentsWithPrefix(nodes: Array<Node>, prefix: string): Array<Node> {
    const filteredNodes: Array<Node> = []
    walk(nodes, (node: Node) => {
      if (node?.name?.startsWith(prefix)) {
        filteredNodes.push(node)
      }
    })
    return filteredNodes
  }
}
