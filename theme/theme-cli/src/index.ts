import { createInterface } from 'node:readline'

import { program }         from 'commander'
import logger              from 'npmlog'

import { run }             from './run.js'

logger.heading = 'figma-theme' as string
;(program as any)
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .option('--ignored-pages <ignoredPages>', 'Ignored pages', (value) =>
    value.split(',').map((page) => page.replace('-', ':')))
  .option('--included-pages <includedPages>', 'Included pages', (value) =>
    value.split(',').map((page) => page.replace('-', ':')))
  .option('--prefix <prefix>', 'Prefix for components')
  .option('--method <method>', 'Method for components: default or secondary')
  .arguments('<fileId>')
  .parse(process.argv)

if ((program as any).verbose) {
  logger.level = 'verbose'
}

const [fileId] = (program as any).args
const options = (program as any).opts()

if (!fileId) {
  logger.error('fileId', 'Figma file id required.')
} else {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  readline.question(`Enter your Figma access token:\n`, (id) => {
    if (!id || id === '') throw Error('ID must not be empty')
    // eslint-disable-next-line dot-notation
    process.env['FIGMA_TOKEN'] = id

    readline.close()

    run(
      fileId,
      (program as any).output,
      options.ignoredPages,
      options.includedPages,
      options.prefix,
      options.method
    )
      .then(() => logger.info('info', 'Theme successful generated'))
      .catch((error) => logger.error('error', error.message))
  })
}
