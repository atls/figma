import type { Instance }      from 'figma-js'

import { describe }           from 'node:test'
import { beforeEach }         from 'node:test'
import { it }                 from 'node:test'
import { mock }               from 'node:test'

import { expect }             from 'playwright/test'
import React                  from 'react'

import { CreateLinkStrategy } from './create-link.strategy.js'

describe('CreateLinkStrategy', () => {
  let strategy: CreateLinkStrategy

  beforeEach(() => {
    strategy = new CreateLinkStrategy()
  })

  describe('getImports', () => {
    it('returns the correct import statement', () => {
      expect(strategy.getImports()).toEqual([`import { Link } from '@ui/link'`])
    })
  })

  describe('createElement', () => {
    it('creates a Link element with the correct variant', () => {
      const node = {
        name: 'Pattern/Link',
        componentProperties: {
          Style: { value: 'Primary' },
        },
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as never as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'Link',
        { variant: 'primary', href: 'Pattern/Link' },
      ])
    })

    it('handles missing node properties gracefully', () => {
      const node = {}

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'Link',
        { variant: undefined, href: undefined },
      ])
    })
  })
})
