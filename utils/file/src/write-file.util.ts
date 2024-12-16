import { promises } from 'node:fs'
import path         from 'node:path'

import prettier     from 'prettier'

export const writeFile = async (filePath: string, name: string, content: string): Promise<void> => {
  const target = path.join(filePath, name)

  const options = await prettier.resolveConfig(target)

  const data = await prettier.format(content, { ...options })

  await promises.writeFile(target, data)
}
