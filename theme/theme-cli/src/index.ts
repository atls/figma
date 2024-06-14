import program from 'commander'
import logger  from 'npmlog'

import { run } from './run.js'

logger.heading = 'figma-theme' as string
;(program as any)
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .option('--ignored-pages <ignoredPages>', 'Ignored pages', (value) =>
    value.split(',').map((page) => page.replace('-', ':')))
  .option('--included-pages <includedPages>', 'Included pages', (value) =>
    value.split(',').map((page) => page.replace('-', ':')))
  .option('--prefix <prefix>', 'Prefix for components')
  .arguments('<fileId>')
  .parse(process.argv)

if ((program as any).verbose) {
  logger.level = 'verbose'
}

const [fileId] = (program as any).args
const options = (program as any).opts()

if (!fileId) {
  logger.error('Figma file id required.')
} else {
  const readline = require('readline').createInterface({
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
      options.prefix
    )
      .then(() => logger.info('Theme successful generated'))
      .catch((error) => logger.error(error.message))
  })
}
