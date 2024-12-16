import { Fragment }             from 'react'
import { createElement }        from 'react'

import { CreateButtonStrategy } from '../create-button.strategy.js'

jest.mock('react', () => ({
  createElement: jest.fn(),
}))

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
      } as any

      strategy.createElement(node)

      expect(createElement).toHaveBeenCalledWith('Button', {
        variant: 'primary',
      })
    })

    it('creates a Fragment element when componentProperties are missing', () => {
      const node = {} as any

      strategy.createElement(node)

      expect(createElement).toHaveBeenCalledWith(Fragment)
    })

    it('creates a Fragment element when Style is not defined in componentProperties', () => {
      const node = {
        componentProperties: {},
      } as any

      strategy.createElement(node)

      expect(createElement).toHaveBeenCalledWith(Fragment)
    })
  })
})
