import path                             from 'path'
import prettier                         from 'prettier'
import { promises as fs }               from 'fs'

import { FigmaFileLoader }              from '@atls/figma-file-loader'
import { FigmaThemeFragmentsGenerator } from '@atls/figma-fragments-generator'

export const run = async (fileId, nodeId, output) => {
  const loader = new FigmaFileLoader()
  const generator = new FigmaThemeFragmentsGenerator()

  const response = await loader.loadNode(fileId, nodeId)

  console.log(response.nodes[nodeId]?.document)

  const component = generator.generate(response)

  const target = path.join(output, 'fragments.tsx')

  const options = await prettier.resolveConfig(target)

  const data = await prettier.format(component, { ...options })

  await fs.writeFile(target, data)
}
