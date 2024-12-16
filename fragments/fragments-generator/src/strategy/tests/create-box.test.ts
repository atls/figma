import { Frame }             from 'figma-js'
import { createElement }     from 'react'

import { CreateBoxStrategy } from '../create-box.strategy.js'
import { theme }             from './tests.constants.js'

jest.mock('react', () => ({
  createElement: jest.fn(),
}))

describe('CreateBoxStrategy', () => {
  let strategy: CreateBoxStrategy

  beforeEach(() => {
    strategy = new CreateBoxStrategy(theme)
  })

  describe('getImports', () => {
    it('returns the Box import statement', () => {
      expect(strategy.getImports()).toEqual([`import { Box } from '@ui/layout'`])
    })
  })

  describe('createElement', () => {
    it('creates a Box element with appropriate props', () => {
      const mockNode: Partial<Frame> = {
        layoutMode: 'HORIZONTAL',
        itemSpacing: 16,
        counterAxisAlignItems: 'CENTER',
        primaryAxisAlignItems: 'CENTER',
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        cornerRadius: 4,
        strokes: [
          { type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 }, opacity: 0.8, blendMode: 'COLOR' },
        ],
        strokeWeight: 1,
        background: [{ color: { r: 1, g: 1, b: 1, a: 1 }, type: 'SOLID', blendMode: 'COLOR' }],
        effects: [
          {
            type: 'DROP_SHADOW',
            radius: 4,
            offset: { x: 2, y: 2 },
            color: { r: 1, g: 1, b: 1, a: 1 },
            visible: true,
          },
        ],
        absoluteBoundingBox: { x: 0, y: 0, width: 300, height: 100 },
      }

      strategy.createElement(mockNode as Frame)

      expect(createElement).toHaveBeenCalledWith('Box', {
        width: '300px',
        height: '100px',
        flexDirection: undefined,
        justifyContent: 'center',
        alignItems: 'center',
        background: '$white',
        gap: '$medium',
        border: '1px solid rgba(255, 255, 255, 0.80)',
        borderRadius: '4px',
        boxShadow: '2px 2px 4px rgba(255, 255, 255, 1)',
        padding: '10px',
      })
    })

    it('handles missing node properties gracefully', () => {
      const mockNode: Partial<Frame> = {
        layoutMode: undefined,
        itemSpacing: undefined,
        counterAxisAlignItems: undefined,
        primaryAxisAlignItems: undefined,
        paddingBottom: undefined,
        paddingLeft: undefined,
        paddingRight: undefined,
        paddingTop: undefined,
        cornerRadius: undefined,
        strokes: [],
        strokeWeight: 2,
        background: [],
        effects: [],
        absoluteBoundingBox: { x: 0, y: 0, width: 300, height: 100 },
      }

      strategy.createElement(mockNode as Frame)

      expect(createElement).toHaveBeenCalledWith('Box', {
        width: '300px',
        height: '100px',
        flexDirection: undefined,
        justifyContent: undefined,
        alignItems: undefined,
        background: undefined,
        gap: undefined,
        border: undefined,
        borderRadius: undefined,
        boxShadow: undefined,
      })
    })
  })
})
