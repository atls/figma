import assert                           from 'node:assert'

import { join }                         from 'path'

import { FigmaFileLoader }              from '@atls/figma-file-loader'
import { FigmaThemeFragmentsGenerator } from '@atls/figma-fragments-generator'
import { processFile }                  from '@atls/figma-file-utils'
import { writeFile }                    from '@atls/figma-file-utils'

export const run = async (
  fileId: string,
  nodeId: string,
  output: string,
  themeFilePath: string
) => {
  const absoluteThemeFilePath = join(process.cwd(), themeFilePath)
  const exports = processFile(absoluteThemeFilePath)

  const theme = Object.values(exports)?.[0] as Record<string, Record<string, string>>

  assert.ok(
    theme,
    `Could not process the theme with path ${absoluteThemeFilePath}. Please try again`
  )

  const loader = new FigmaFileLoader()
  const generator = new FigmaThemeFragmentsGenerator()

  const response = await loader.loadNode(fileId, nodeId)

  const component = generator.generate(response, theme)

  await writeFile(output, 'fragments.tsx', component)
}
