import { FileResponse }    from 'figma-js'

import { FigmaFileLoader } from '@atls/figma-file-loader'
import { FigmaTheme }      from '@atls/figma-theme'

export const run = async (fileId, output, ignoredPages, includedPages, prefix, method) => {
  const loader = new FigmaFileLoader()

  const file: FileResponse = await loader.load(fileId)

  const theme = new FigmaTheme(file, output, ignoredPages, includedPages, prefix, method)

  await theme.generate()
}
