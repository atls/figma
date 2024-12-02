import { createInterface } from 'node:readline'

import logger              from 'npmlog'
import { program }         from 'commander'

import { run }             from './run.js'

logger.heading = 'figma-fragments'

program
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .option('-n, --node-id <nodeId>', 'Node id for generating')
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
  // const readline = createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // })

  // readline.question(`Enter your Figma access token:\n`, (id) => {
  //   if (!id || id === '') throw Error('ID must not be empty')
  //   // eslint-disable-next-line dot-notation

  //   readline.close()

  // })

  process.env['FIGMA_TOKEN'] = 'secret'

  run(fileId, options.nodeId?.replace('-', ':'), options.output)
    .then(() => logger.info('info', 'Fragments successful generated'))
    .catch((error) => logger.error('error', error.message))
}
