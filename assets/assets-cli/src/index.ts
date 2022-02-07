import program from 'commander'
import logger from 'npmlog'
import { run } from './run'

logger.heading = 'figma-assets'

program
  .option('-o, --output [output]', 'Output dir')
  .option('-v, --verbose', 'Verbose output')
  .arguments('<fileId> <documentId>')
  .parse(process.argv)

if (program.verbose) {
  logger.level = 'verbose'
}

const [fileId, documentId] = program.args

if (!fileId) {
  logger.error('Figma file id required.')
} else if (!documentId) {
  logger.error('Figma document id required.')
} else {
  run(fileId, documentId, program.output)
    .then(() => logger.info('Assets successful generated'))
    .catch(error => logger.error(error.message))
}
