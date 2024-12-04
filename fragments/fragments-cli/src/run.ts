import { transform }                    from '@babel/standalone'

import path                             from 'path'
import prettier                         from 'prettier'
import { promises as fs }               from 'fs'
import { readFileSync }                 from 'fs'
import { join }                         from 'path'

import { FigmaFileLoader }              from '@atls/figma-file-loader'
import { FigmaThemeFragmentsGenerator } from '@atls/figma-fragments-generator'

const processFile = (filePath: string): any => {
  const replacementsFile = readFileSync(filePath.replace('.js', '.ts')).toString('utf-8')
  const { code } = transform(replacementsFile, {
    presets: ['env'],
    plugins: ['transform-modules-commonjs'],
  })

  if (!code) throw Error('Could not read the file')

  // eslint-disable-next-line no-eval, security/detect-eval-with-expression
  const module = { exports: {} }
  const exports = module.exports
  const require = (modulePath) => {
    const absolutePath = path.resolve(path.dirname(filePath), modulePath)
    return processFile(absolutePath)
  }
  eval(`
    (function(exports, module, require) {
      ${code}
    })(exports, module, require);
  `)
  return module.exports
}

export const run = async (fileId, nodeId, output, themeFilePath) => {
  const theme: Record<string, Record<string, string>> = processFile(
    join(process.cwd(), themeFilePath)
  ).lightThemeTokens

  const loader = new FigmaFileLoader()
  const generator = new FigmaThemeFragmentsGenerator()

  const response = await loader.loadNode(fileId, nodeId)

  const component = generator.generate(response, theme)

  const target = path.join(output, 'fragments.tsx')

  const options = await prettier.resolveConfig(target)

  const data = await prettier.format(component, { ...options })

  await fs.writeFile(target, data)
}
