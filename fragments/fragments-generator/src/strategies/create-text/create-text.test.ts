import type { Text }          from 'figma-js'

import { createElement }      from 'react'

import { CreateTextStrategy } from './create-text.strategy.js'
import { theme }              from '../strategies.constants.js'

jest.mock('react', () => ({
  createElement: jest.fn(),
}))

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
        fills: [
          { type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 }, opacity: 1, blendMode: 'COLOR' },
        ],
      }
      jest.spyOn(strategy, 'getColor').mockReturnValue('$white')
      jest.spyOn(strategy, 'getFontSize').mockReturnValue('$small')
      jest.spyOn(strategy, 'getFontWeight').mockReturnValue('$regular')
      jest.spyOn(strategy, 'getLineHeight').mockReturnValue('16px')
      jest.spyOn(strategy, 'getTextAlign').mockReturnValue('right')

      strategy.createElement(node as never as Text)

      expect(createElement).toHaveBeenCalledWith('FormattedMessage', {
        id: 'test_text',
        defaultMessage: 'Test text',
      })

      expect(createElement).toHaveBeenLastCalledWith(
        'Text',
        {
          color: '$white',
          fontSize: '$small',
          fontWeight: '$regular',
          lineHeight: '16px',
          textAlign: 'right',
        },
        undefined
      )
    })

    it('handles missing characters gracefully', () => {
      const node = {
        characters: undefined,
        style: {},
        fills: [],
      }

      strategy.createElement(node as never as Text)

      expect(createElement).toHaveBeenCalledWith('FormattedMessage', {
        id: 'text',
        defaultMessage: undefined,
      })

      expect(createElement).toHaveBeenCalledWith(
        'Text',
        {
          color: undefined,
          fontSize: undefined,
          fontWeight: undefined,
          lineHeight: undefined,
          textAlign: undefined,
        },
        undefined
      )
    })
  })
})
