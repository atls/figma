import { Fragment }            from 'react'
import { createElement }       from 'react'

import { CreateInputStrategy } from './create-input.strategy.js'

jest.mock('react', () => ({
  createElement: jest.fn(),
}))

describe('CreateInputStrategy', () => {
  let strategy: CreateInputStrategy

  beforeEach(() => {
    strategy = new CreateInputStrategy()
    jest.clearAllMocks()
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
      } as any

      strategy.createElement(node)

      expect(createElement).toHaveBeenCalledWith('Input', {
        variant: 'primary',
        placeholder: 'Test text',
      })
    })

    it('creates an Input element without a placeholder when no valid field is found', () => {
      const node = {
        componentProperties: {
          Type: { value: 'Primary' },
        },
        children: [],
      } as any

      strategy.createElement(node)

      expect(createElement).toHaveBeenCalledWith('Input', {
        variant: 'primary',
        placeholder: undefined,
      })
    })

    it('creates a Fragment element when componentProperties are missing', () => {
      const node = {} as any

      strategy.createElement(node)

      expect(createElement).toHaveBeenCalledWith(Fragment)
    })
  })
})
