import { THEME_KEY_PREFIX }     from './strategy.constants.js'
import { colorsIgnorePatterns } from './strategy.constants.js'

export class ThemeMappingStrategy {
  private theme: Record<string, Record<string, string>> = {}

  constructor(theme: Record<string, Record<string, string>>) {
    this.theme = theme
  }

  getValueKeyFromTheme(themeKey: string, search: string) {
    const vars = this.theme[themeKey]

    if (!vars) {
      return
    }

    const valueKey = Object.entries(vars).find(([key, value]) => {
      if (themeKey === 'colors' && colorsIgnorePatterns.some((pattern) => key.includes(pattern))) {
        return false
      }

      return value === search
    })?.[0]

    return valueKey ? `${THEME_KEY_PREFIX}${valueKey}` : undefined
  }
}
