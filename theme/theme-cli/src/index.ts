/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { createInterface } from 'node:readline'

import { program }         from 'commander'
import logger              from 'npmlog'

import { run }             from './run.js'

logger.heading = 'figma-theme'
program
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .option('--ignored-pages <ignoredPages>', 'Ignored pages', (value) =>
    value.split(',').map((page) => page.replace('-', ':')))
  .option('--included-pages <includedPages>', 'Included pages', (value) =>
    value.split(',').map((page) => page.replace('-', ':')))
  .option('--method <method>', 'Method for components: default or secondary')
  .option('--prefix <prefix>', 'Prefix for components')
  .arguments('<fileId>')
  .parse(process.argv)

const fileId = program.args.at(0)
const options = program.opts()

if (options.verbose) {
  logger.level = 'verbose'
}

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
      options.output,
      options.ignoredPages,
      options.includedPages,
      options.prefix,
      options.method
    )
      .then((): void => {
        logger.info('info', 'Theme successful generated')
      })
      .catch((error): void => {
        logger.error('error', error.message)
      })
  })
}
