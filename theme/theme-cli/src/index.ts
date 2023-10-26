import program from 'commander'
import logger  from 'npmlog'

import { run } from './run'

logger.heading = 'figma-theme' as string
;(program as any)
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .arguments('<fileId>')
  .parse(process.argv)

if ((program as any).verbose) {
  logger.level = 'verbose'
}

const [fileId] = (program as any).args

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
    run(fileId, (program as any).output)
      .then(() => logger.info('Theme successful generated'))
      .catch((error) => logger.error(error.message))
  })
}
