import path                               from 'path'
import prettier                           from 'prettier'
import { FileResponse }                   from 'figma-js'
import { promises as fs }                 from 'fs'

import { FigmaThemeColorsGenerator }      from '@atls/figma-theme-colors-generator'
import { FigmaThemeFontSizesGenerator }   from '@atls/figma-theme-font-sizes-generator'
import { FigmaThemeFontWeightsGenerator } from '@atls/figma-theme-font-weights-generator'
import { FigmaThemeFontsGenerator }       from '@atls/figma-theme-fonts-generator'
import { FigmaThemeLineHeightsGenerator } from '@atls/figma-theme-line-heights-generator'
import { FigmaThemeRadiiGenerator }       from '@atls/figma-theme-radii-generator'
import { FigmaThemeShadowsGenerator }     from '@atls/figma-theme-shadows-generator'

const generators = [
  FigmaThemeFontSizesGenerator,
  FigmaThemeFontWeightsGenerator,
  FigmaThemeFontsGenerator,
  FigmaThemeLineHeightsGenerator,
  FigmaThemeColorsGenerator,
  FigmaThemeRadiiGenerator,
  FigmaThemeShadowsGenerator,
]

export class FigmaTheme {
  file: FileResponse

  output: string
  ignoredPages: string[]

  constructor(file: FileResponse, output, ignoredPages: string[] = []) {
    this.file = file

    this.output = path.join(process.cwd(), output || 'theme')
    this.ignoredPages = ignoredPages
  }

  async format(target, content) {
    const options = await prettier.resolveConfig(target)

    return prettier.format(content, { ...options })
  }

  async write({ name, content }) {
    const target = path.join(this.output, `${name}.ts`)

    const data = await this.format(target, content)

    await fs.writeFile(target, data)
  }

  async generate() {
    const fileData = {
      ...this.file,
      document: {
        ...this.file.document,
        children: this.file.document.children.filter(
          (node) => node.type === 'CANVAS' && !this.ignoredPages.includes(node.id)
        ),
      },
    }

    await Promise.all(
      fileData.document.children.map(async () => {
        generators.forEach(async (Generator) => {
          const instance = new Generator()
          const result = await Promise.resolve(instance.generate(fileData))
          await this.write(result)
        })
      })
    )
  }
}
