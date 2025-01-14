import type { Node }       from 'figma-js'

import fs                  from 'fs-extra'
import fetch               from 'node-fetch'
import path                from 'path'

import { FigmaFileLoader } from '@atls/figma-file-loader'

export class FigmaAssets {
  fileId: string

  node: Node

  output: string

  client: FigmaFileLoader = new FigmaFileLoader()

  constructor(fileId: string, node: Node, output: string = 'assets') {
    this.fileId = fileId
    this.node = node

    this.output = path.join(process.cwd(), output)
  }

  async loadImage(name: string, url: string): Promise<void> {
    const fileName = `${name.replace(/ /g, '-').replace(/_/g, '-')}.svg`
    const filePath = path.join(this.output, fileName)

    await fs.ensureDir(path.dirname(filePath))

    const response = await fetch(url)

    if (response.status !== 200) {
      return
    }

    const file = fs.createWriteStream(filePath)

    response.body?.pipe(file)
  }

  async generate(): Promise<void> {
    if (!('children' in this.node)) {
      return
    }

    const { children } = this.node

    const items: Array<{ id: string; name: string }> = []

    children
      .filter((item) => item.type === 'COMPONENT')
      .forEach((item) => {
        items.push({ id: item.id, name: item.name })
      })

    const images = await this.client.fileImages(
      this.fileId,
      items.map((item) => item.id)
    )

    await Promise.all(
      items.map(async (item) => {
        if (images[item.id]) await this.loadImage(item.name, images[item.id])
      })
    )
  }
}
