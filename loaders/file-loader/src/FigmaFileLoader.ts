import { Client }            from 'figma-js'
import { ClientInterface }   from 'figma-js'
import { FileResponse }      from 'figma-js'
import { FileNodesResponse } from 'figma-js'
import { Node }              from 'figma-js'

export class FigmaFileLoader {
  figma: ClientInterface

  constructor() {
    this.figma = Client({
      personalAccessToken: process.env.FIGMA_TOKEN,
    })
  }

  async load(fileId: string): Promise<FileResponse> {
    const { data } = await this.figma.file(fileId)
    return data
  }

  async loadNode(fileId: string, nodeId: string): Promise<FileNodesResponse> {
    const { data } = await this.figma.fileNodes(fileId, { ids: [nodeId.replace('-', ':')] })
    return data
  }

  async loadDocument(fileId: string, documentId: string): Promise<Node> {
    const file = await this.load(fileId)

    const node = file.document.children.find((doc) => doc.id === documentId)

    if (!node) {
      throw new Error(`Document with id ${documentId} not found. Please try again`)
    }
    return node
  }

  async fileImages(fileId: string, itemIds: string[]) {
    const { data } = await this.figma.fileImages(fileId, {
      ids: itemIds,
      format: 'svg',
      scale: 1,
    })
    return data.images
  }
}
