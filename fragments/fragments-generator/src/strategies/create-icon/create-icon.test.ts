import type { Instance }      from 'figma-js'

import { describe }           from 'node:test'
import { beforeEach }         from 'node:test'
import { it }                 from 'node:test'
import { mock }               from 'node:test'

import { expect }             from 'playwright/test'
import React                  from 'react'

import { CreateIconStrategy } from './create-icon.strategy.js'
import { theme }              from '../strategies.constants.js'

describe('CreateIconStrategy', () => {
  let strategy: CreateIconStrategy

  beforeEach(() => {
    strategy = new CreateIconStrategy(theme)
  })

  describe('getImports', () => {
    it('returns the Icon import statement', () => {
      expect(strategy.getImports()).toEqual([`import { Icon } from '@ui/icon'`])
    })
  })

  describe('createElement', () => {
    it('creates a Icon element with appropriate props', () => {
      const mockNode = {
        name: 'test-name',
        absoluteBoundingBox: { x: 0, y: 0, width: 24, height: 16 },
        children: [
          {
            name: 'Shape',
            type: 'VECTOR',
            fills: [{ color: { r: 1, g: 1, b: 1, a: 1 }, blendMode: 'COLOR', type: 'SOLID' }],
          },
        ],
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(mockNode as never as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'TestNameIcon',
        {
          width: '24px',
          height: '16px',
          color: '$white',
        },
      ])
    })

    it('handles missing node properties gracefully', () => {
      const mockNode = {
        name: 'test-name',
        absoluteBoundingBox: { x: 0, y: 0 },
        children: [
          {
            name: 'Shape',
            type: 'VECTOR',
            fills: [],
          },
        ],
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(mockNode as never as Instance)

      expect(mockCreateElement.mock.callCount()).toEqual(1)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'TestNameIcon',
        {
          width: undefined,
          height: undefined,
          color: undefined,
        },
      ])
    })
  })
})
