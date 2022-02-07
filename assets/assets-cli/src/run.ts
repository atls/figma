import { Node } from 'figma-js'
import { FigmaFileLoader } from '@atls/figma-file-loader'
import { FigmaAssets } from '@atls/figma-assets'

export const run = async (fileId, documentId, output) => {
  const loader = new FigmaFileLoader()

  const node: Node = await loader.loadDocument(fileId, documentId)

  const assets = new FigmaAssets(fileId, node, output)

  assets.generate()
}
