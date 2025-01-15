import type { Paint }          from 'figma-js'

import { describe }            from 'node:test'
import { beforeEach }          from 'node:test'
import { it }                  from 'node:test'
import { mock }                from 'node:test'

import { expect }              from 'playwright/test'
import React                   from 'react'

import { CreateImageStrategy } from './create-image.strategy.js'

describe('CreateImageStrategy', () => {
  let strategy: CreateImageStrategy

  beforeEach(() => {
    strategy = new CreateImageStrategy({ 'image-ref': 'imag-url' })
  })

  describe('getImports', () => {
    it('returns the correct import statement', () => {
      expect(strategy.getImports()).toEqual([`import { NextImage } from '@ui/image'`])
    })
  })

  describe('createElement', () => {
    it('creates a Image element with the correct variant', () => {
      const background: ReadonlyArray<Paint> = [
        {
          blendMode: 'NORMAL',
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageRef: 'image-ref',
        },
      ]

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElements(background, 'Layout')

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'NextImage',
        { alt: 'Layout', src: 'imag-url' },
      ])
    })

    it('handles missing node properties gracefully', () => {
      const background: ReadonlyArray<Paint> = [
        {
          blendMode: 'NORMAL',
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageRef: undefined,
        },
      ]

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElements(background, 'Layout')

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'NextImage',
        { alt: 'Layout', src: undefined },
      ])
    })
  })
})
