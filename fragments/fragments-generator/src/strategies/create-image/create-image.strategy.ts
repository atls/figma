import type { Paint }        from 'figma-js'
import type { ReactElement } from 'react'

import React                 from 'react'

export class CreateImageStrategy {
  private images: Record<string, string> = {}

  constructor(images: Record<string, string>) {
    this.images = images
  }

  getImports(): Array<string> {
    return [`import { NextImage } from '@ui/image'`]
  }

  createElements(background: ReadonlyArray<Paint>, nodeName: string): Array<ReactElement> {
    const elements: Array<ReactElement> = []

    background.forEach((item) => {
      if (item.type !== 'IMAGE') {
        return
      }

      const imageElement = React.createElement('NextImage', {
        src: item.imageRef ? this.images[item.imageRef] : undefined,
        alt: nodeName,
      })

      elements.push(imageElement)
    })

    return elements
  }
}
