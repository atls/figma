import assert           from 'node:assert'

import { transform }    from '@babel/standalone'

import path             from 'path'
import { readFileSync } from 'fs'

export const processFile = (filePath: string): any => {
  const file = readFileSync(filePath.replace('.js', '.ts')).toString('utf-8')

  const { code } = transform(file, {
    presets: ['env'],
    plugins: ['transform-modules-commonjs'],
  })

  assert.ok(code, `Could not process the code with path ${filePath}. Please try again`)

  const module = { exports: {} }
  const exports = module.exports
  const require = (modulePath: string): any => {
    const absolutePath = path.resolve(path.dirname(filePath), modulePath)
    return processFile(absolutePath)
  }

  // eslint-disable-next-line no-eval, security/detect-eval-with-expression
  eval(`
    (function(exports, module, require) {
      ${code}
    })(exports, module, require);
  `)

  return module.exports
}
