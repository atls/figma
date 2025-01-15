import assert                           from 'node:assert/strict'
import { join }                         from 'node:path'

import kebabCase                        from 'kebab-case'

import { FigmaFileLoader }              from '@atls/figma-file-loader'
import { FigmaThemeFragmentsGenerator } from '@atls/figma-fragments-generator'
import { writeFile }                    from '@atls/figma-file-utils'
import { processFile }                  from '@atls/figma-file-utils'

export const run = async (
  fileId: string,
  nodeId: string,
  output: string,
  themeFilePath: string,
  name: string = 'GeneratedFragment'
): Promise<void> => {
  const absoluteThemeFilePath = join(process.cwd(), themeFilePath)
  const exports = processFile(absoluteThemeFilePath)

  const theme = Object.values(exports)?.[0] as Record<string, Record<string, string>>

  assert.ok(
    theme,
    `Could not process the theme with path ${absoluteThemeFilePath}. Please try again`
  )

  const loader = new FigmaFileLoader()
  const generator = new FigmaThemeFragmentsGenerator()

  const fileResponse = await loader.loadNode(fileId, nodeId)
  const images = await loader.fileImageFills(fileId)

  const component = generator.generate(fileResponse, theme, images, name)

  const fileName = `${kebabCase(name, false)}.component.tsx`

  await writeFile(output, fileName, component)
}
