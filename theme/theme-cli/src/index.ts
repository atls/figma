import program from 'commander'
import logger from 'npmlog'
import { run } from './run'

logger.heading = 'figma-theme'

program
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .arguments('<fileId>')
  .parse(process.argv)

if (program.verbose) {
  logger.level = 'verbose'
}

const [fileId] = program.args

if (!fileId) {
  logger.error('Figma file id required.')
} else {
  run(fileId, program.output)
    .then(() => logger.info('Theme successful generated'))
    .catch(error => logger.error(error.message))
}
