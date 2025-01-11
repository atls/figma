import type { Node }       from 'figma-js'

import { FigmaAssets }     from '@atls/figma-assets'
import { FigmaFileLoader } from '@atls/figma-file-loader'

export const run = async (fileId: string, documentId: string, output: string): Promise<void> => {
  const loader = new FigmaFileLoader()

  const node: Node = await loader.loadDocument(fileId, documentId)
  const assets = new FigmaAssets(fileId, node, output)
  assets.generate()
}
