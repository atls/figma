import type { Instance }       from 'figma-js'

import { describe }            from 'node:test'
import { beforeEach }          from 'node:test'
import { it }                  from 'node:test'
import { mock }                from 'node:test'

import { Fragment }            from 'react'
import { expect }              from 'playwright/test'
import React                   from 'react'

import { CreateInputStrategy } from './create-input.strategy.js'

describe('CreateInputStrategy', () => {
  let strategy: CreateInputStrategy

  beforeEach(() => {
    strategy = new CreateInputStrategy()
  })

  describe('getImports', () => {
    it('returns the correct import statement', () => {
      expect(strategy.getImports()).toEqual([`import { Input } from '@ui/input'`])
    })
  })

  describe('createElement', () => {
    it('creates an Input element with a variant and placeholder', () => {
      const node = {
        componentProperties: {
          Type: { value: 'Primary' },
        },
        children: [
          {
            name: 'Field',
            type: 'FRAME',
            children: [{ type: 'TEXT', characters: 'Test text' }],
          },
        ],
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as unknown as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'Input',
        { variant: 'primary', placeholder: 'Test text' },
      ])
    })

    it('creates an Input element without a placeholder when no valid field is found', () => {
      const node = {
        componentProperties: {
          Type: { value: 'Primary' },
        },
        children: [],
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as unknown as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'Input',
        { variant: 'primary', placeholder: undefined },
      ])
    })

    it('creates a Fragment element when componentProperties are missing', () => {
      const node = {}

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([Fragment])
    })
  })
})
