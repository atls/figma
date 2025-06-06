import { createInterface } from 'node:readline'

import { program }         from 'commander'
import { pino }            from 'pino'

import { run }             from './run.js'

const logger = pino({
  name: 'figma-fragments',
  level: process.env.LOG_LEVEL ?? 'debug',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' },
  },
  base: undefined,
})

program
  .option('-o, --output [output]', 'Output dir')
  .option('-t, --theme <theme>', 'Path to theme file')
  .option('-v, --verbose', 'Verbose output')
  .option('-n, --node-id <nodeId>', 'Node id for generating')
  .option('--name <name>', 'The name of the generated fragment')
  .arguments('<fileId>')
  .parse(process.argv)

const fileId = program.args.at(0)
const options = program.opts()

if (options.verbose) {
  logger.level = 'debug'
}

if (!fileId) {
  logger.error('fileId', 'Figma file id required.')
} else {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  readline.question(`Enter your Figma access token:\n`, (id) => {
    if (!id) {
      logger.error('ID must not be empty')
      readline.close()
      return
    }
    // eslint-disable-next-line dot-notation
    process.env['FIGMA_TOKEN'] = id

    readline.close()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    run(fileId, options.nodeId, options.output, options.theme, options.name)
      .then((): void => {
        logger.info('Fragments successful generated')
      })
      .catch((error): void => {
        logger.error(error, 'Error generating fragments')
      })
  })
}
