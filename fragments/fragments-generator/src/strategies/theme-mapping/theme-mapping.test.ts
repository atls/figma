import type { Effect }          from 'figma-js'
import type { Paint }           from 'figma-js'

import { describe }             from 'node:test'
import { beforeEach }           from 'node:test'
import { it }                   from 'node:test'

import { expect }               from 'playwright/test'

import { THEME_KEY_PREFIX }     from '../strategies.constants.js'
import { ThemeMappingStrategy } from './theme-mapping.strategy.js'
import { theme }                from '../strategies.constants.js'

describe('ThemeMappingStrategy', () => {
  let strategy: ThemeMappingStrategy

  beforeEach(() => {
    strategy = new ThemeMappingStrategy(theme)
  })

  describe('getValueKeyFromTheme', () => {
    it('returns the key from the theme when a matching value is found', () => {
      expect(strategy.getValueKeyFromTheme('colors', theme.colors.white)).toBe(
        `${THEME_KEY_PREFIX}white`
      )
    })

    it('returns undefined when no matching value is found', () => {
      expect(strategy.getValueKeyFromTheme('colors', 'rgba(0, 0, 0, 1)')).toBeUndefined()

      expect(strategy.getValueKeyFromTheme('texts', 'test')).toBeUndefined()
    })
  })

  describe('getColor', () => {
    it('returns the color key from the theme when opacity is provided', () => {
      const fills: Array<Paint> = [
        { color: { r: 1, g: 1, b: 1, a: 1 }, blendMode: 'COLOR', type: 'SOLID' },
      ]

      expect(strategy.getColor(fills)).toBe(`${THEME_KEY_PREFIX}white`)
    })

    it('returns undefined when no fills are provided', () => {
      expect(strategy.getColor([])).toBeUndefined()
    })
  })

  describe('getFontSize', () => {
    it('returns the font size key from the theme', () => {
      expect(strategy.getFontSize(parseInt(theme.fontSizes.small, 10))).toBe(
        `${THEME_KEY_PREFIX}small`
      )

      expect(strategy.getFontSize(14)).toBe('14px')
    })
  })

  describe('getFontWeight', () => {
    it('returns the font weight key from the theme', () => {
      expect(strategy.getFontWeight(600)).toBe(`${THEME_KEY_PREFIX}bold`)

      expect(strategy.getFontWeight(900)).toBe(900)
    })
  })

  describe('getTextAlign', () => {
    it('returns undefined for LEFT alignment', () => {
      expect(strategy.getTextAlign('LEFT')).toBeUndefined()
    })

    it('returns lowercase text alignment for other values', () => {
      expect(strategy.getTextAlign('CENTER')).toBe('center')
      expect(strategy.getTextAlign('RIGHT')).toBe('right')
      expect(strategy.getTextAlign('JUSTIFIED')).toBe('justify')
    })
  })

  describe('getLineHeight', () => {
    it('returns the line height key from the theme', () => {
      expect(strategy.getLineHeight(150, 20)).toBe('20px')
    })
  })

  describe('getFlexDirection', () => {
    it('returns column for VERTICAL layout mode', () => {
      expect(strategy.getFlexDirection('VERTICAL')).toBe('column')
    })

    it('returns undefined for other layout modes', () => {
      expect(strategy.getFlexDirection('HORIZONTAL')).toBeUndefined()
      expect(strategy.getFlexDirection('NONE')).toBeUndefined()
    })
  })

  describe('getJustifyContent', () => {
    it('returns justify content for other SPACE_BETWEEN and CENTER values', () => {
      expect(strategy.getJustifyContent('SPACE_BETWEEN')).toBe('space-between')
      expect(strategy.getJustifyContent('CENTER')).toBe('center')
    })

    it('returns undefined for other alignments', () => {
      expect(strategy.getJustifyContent('MAX')).toBeUndefined()
      expect(strategy.getJustifyContent('MIN')).toBeUndefined()
    })
  })

  describe('getAlignItems', () => {
    it('returns center for CENTER alignment', () => {
      expect(strategy.getAlignItems('CENTER')).toBe('center')
    })

    it('returns undefined for other alignments', () => {
      expect(strategy.getAlignItems('MAX')).toBeUndefined()
      expect(strategy.getAlignItems('MIN')).toBeUndefined()
    })
  })

  describe('getGap', () => {
    it('returns the gap value from the theme', () => {
      expect(strategy.getGap(parseInt(theme.spaces.small, 10))).toBe(`${THEME_KEY_PREFIX}small`)
      expect(strategy.getGap(8)).toBe('8px')
    })

    it('returns undefined when no gap is provided', () => {
      expect(strategy.getGap(undefined)).toBeUndefined()
    })
  })

  describe('getBorderRadius', () => {
    it('returns the border radius value from the theme', () => {
      expect(strategy.getBorderRadius(parseInt(theme.radii.small, 10))).toBe(
        `${THEME_KEY_PREFIX}small`
      )
      expect(strategy.getBorderRadius(5)).toBe('5px')
    })

    it('returns undefined when no border radius is provided', () => {
      expect(strategy.getBorderRadius(undefined)).toBeUndefined()
    })
  })

  describe('getBorder', () => {
    it('returns the border value with weight, type, and color', () => {
      const strokes: Array<Paint> = [
        { color: { r: 1, g: 1, b: 1, a: 1 }, blendMode: 'COLOR', type: 'SOLID', opacity: 0.1 },
      ]

      expect(strategy.getBorder(strokes, 1)).toBe(`${THEME_KEY_PREFIX}white`)
    })

    it('returns undefined when strokes are not provided', () => {
      expect(strategy.getBorder([], 1)).toBeUndefined()
    })
  })

  describe('getShadow', () => {
    it('returns the shadow value for DROP_SHADOW effects', () => {
      const effects: Array<Effect> = [
        {
          type: 'DROP_SHADOW',
          radius: 1,
          offset: { x: 0, y: 0 },
          color: { r: 0, g: 0, b: 0, a: 0.12 },
          visible: true,
        },
      ]

      expect(strategy.getShadow(effects)).toBe(`${THEME_KEY_PREFIX}black`)
    })

    it('returns undefined when no valid effects are provided', () => {
      expect(strategy.getShadow([])).toBeUndefined()
    })
  })

  describe('getPadding', () => {
    it('returns the padding value from the theme', () => {
      expect(strategy.getPadding(parseInt(theme.spaces.small, 10))).toBe(`${THEME_KEY_PREFIX}small`)
      expect(strategy.getPadding(10)).toBe('10px')
    })

    it('returns undefined when no padding is provided', () => {
      expect(strategy.getPadding(undefined)).toBeUndefined()
    })
  })

  describe('getPaddings', () => {
    it('returns unified padding when all sides are the same', () => {
      const paddings = { paddingTop: 10, paddingBottom: 10, paddingLeft: 10, paddingRight: 10 }
      expect(strategy.getPaddings(paddings)).toEqual({ padding: '10px' })
    })

    it('returns individual paddings when values differ', () => {
      const paddings = {
        paddingTop: 10,
        paddingBottom: 20,
        paddingLeft: 30,
        paddingRight: 40,
      }
      expect(strategy.getPaddings(paddings)).toEqual({
        paddingTop: '10px',
        paddingBottom: '20px',
        paddingLeft: '30px',
        paddingRight: '40px',
      })
    })

    it('returns combined paddings when applicable', () => {
      const paddings = { paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }
      expect(strategy.getPaddings(paddings)).toEqual({ paddingY: '10px', paddingX: '20px' })
    })
  })
})
