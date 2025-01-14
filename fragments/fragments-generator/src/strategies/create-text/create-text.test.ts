import type { Text }          from 'figma-js'

import { describe }           from 'node:test'
import { beforeEach }         from 'node:test'
import { it }                 from 'node:test'
import { mock }               from 'node:test'

import { expect }             from 'playwright/test'
import React                  from 'react'

import { CreateTextStrategy } from './create-text.strategy.js'
import { theme }              from '../strategies.constants.js'

describe('CreateTextStrategy', () => {
  let strategy: CreateTextStrategy

  beforeEach(() => {
    strategy = new CreateTextStrategy(theme)
  })

  describe('getImports', () => {
    it('returns the Text and FormattedMessage imports', () => {
      expect(strategy.getImports()).toEqual([
        `import { Text } from '@ui/text'`,
        `import { FormattedMessage } from 'react-intl'`,
      ])
    })
  })

  describe('createElement', () => {
    it('creates a Text element with the correct attributes and children', () => {
      const node = {
        characters: 'Test text',
        style: {
          fontSize: 12,
          fontWeight: 400,
          lineHeightPercentFontSize: 120,
          lineHeightPx: 16,
          textAlignHorizontal: 'RIGHT',
        },
        fills: [{ color: { r: 1, g: 1, b: 1, a: 1 }, blendMode: 'COLOR', type: 'SOLID' }],
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as never as Text)

      expect(mockCreateElement.mock.callCount()).toEqual(2)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'FormattedMessage',
        { id: 'test_text', defaultMessage: 'Test text' },
      ])
      expect(mockCreateElement.mock.calls[1].arguments).toEqual([
        'Text',
        {
          color: '$white',
          fontSize: '$small',
          fontWeight: '$regular',
          lineHeight: '$normal',
          textAlign: 'right',
        },
        undefined,
      ])
    })

    it('handles missing characters gracefully', () => {
      const node = {
        characters: undefined,
        style: {},
        fills: [],
      }

      const mockCreateElement = mock.fn()
      mock.method(React, 'createElement', mockCreateElement)

      strategy.createElement(node as never as Text)

      expect(mockCreateElement.mock.callCount()).toEqual(2)
      expect(mockCreateElement.mock.calls[0].arguments).toEqual([
        'FormattedMessage',
        { id: 'text', defaultMessage: undefined },
      ])
      expect(mockCreateElement.mock.calls[1].arguments).toEqual([
        'Text',
        {
          color: undefined,
          fontSize: undefined,
          fontWeight: undefined,
          lineHeight: undefined,
          textAlign: undefined,
        },
        undefined,
      ])
    })
  })
})
