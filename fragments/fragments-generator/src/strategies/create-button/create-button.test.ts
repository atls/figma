import type { Instance }        from 'figma-js'

import { describe }             from 'node:test'
import { beforeEach }           from 'node:test'
import { it }                   from 'node:test'
import { mock }                 from 'node:test'

import { Fragment }             from 'react'
import { expect }               from 'playwright/test'
import React                    from 'react'

import { CreateButtonStrategy } from './create-button.strategy.js'

describe('CreateButtonStrategy', () => {
  let strategy: CreateButtonStrategy

  beforeEach(() => {
    strategy = new CreateButtonStrategy()
  })

  describe('getImports', () => {
    it('returns the correct import statement', () => {
      expect(strategy.getImports()).toEqual([`import { Button } from '@ui/button'`])
    })
  })

  describe('createElement', () => {
    it('creates a Button element with the correct variant', () => {
      const node = {
        componentProperties: {
          Style: { value: 'Primary' },
        },
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as never as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual(['Button', { variant: 'primary' }])
    })

    it('creates a Fragment element when componentProperties are missing', () => {
      const node = {}

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([Fragment])
    })

    it('creates a Fragment element when Style is not defined in componentProperties', () => {
      const node = {
        componentProperties: {},
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as never as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([Fragment])
    })
  })
})
