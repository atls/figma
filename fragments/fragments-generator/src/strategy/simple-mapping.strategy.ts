import { FileNodesResponse }    from 'figma-js'
import { Frame }                from 'figma-js'
import { Paint }                from 'figma-js'
import { Text }                 from 'figma-js'
import { TypeStyle }            from 'figma-js'
import { Fragment }             from 'react'
import { ReactElement }         from 'react'
import { plugins }              from 'pretty-format'
import { format }               from 'pretty-format'
import { cloneElement }         from 'react'
import { createElement }        from 'react'

import { isFrame }              from '@atls/figma-utils'
import { isText }               from '@atls/figma-utils'
import { toColorOpacityString } from '@atls/figma-utils'
import { walk }                 from '@atls/figma-utils'
import { toColorString }        from '@atls/figma-utils'

import { THEME_KEY_PREFIX }     from './strategy.constants.js'
import { TreeElement }          from './strategy.interfaces.js'
import { defaultFigmaColor }    from './strategy.constants.js'
import { colorsIgnorePatterns } from './strategy.constants.js'

export class SimpleMappingStrategy {
  theme: Record<string, Record<string, string>> = {}
  elements: Record<string, TreeElement> = {}

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

  createTextAttributes(style: TypeStyle, fills: readonly Paint[]) {
    const { color = defaultFigmaColor, opacity } = fills[0]

    const stringColor = toColorString(color)
    const themeColor = opacity ? toColorOpacityString(color, opacity) : stringColor

    const themeLineHeight = ((style.lineHeightPercentFontSize || 100) / 100)?.toFixed(1)

    return {
      color: this.getValueKeyFromTheme('colors', themeColor) || stringColor,
      fontSize: this.getValueKeyFromTheme('fontSizes', `${style.fontSize}px`) || style.fontSize,
      fontWeight:
        this.getValueKeyFromTheme('fontWeights', `${style.fontWeight}`) || style.fontWeight,
      lineHeight:
        this.getValueKeyFromTheme('lineHeights', themeLineHeight) || `${style.lineHeightPx}px`,
    }
  }

  createTextElement(node: Text) {
    const { characters, style, fills } = node

    return createElement('Text', this.createTextAttributes(style, fills), characters)
  }

  createFrameElement(node: Frame) {
    return createElement('Box', {})
  }

  createFragmentElement(elements: TreeElement[]) {
    if (elements.length <= 1) {
      return this.createElementsTree(elements[0])
    }

    return createElement(
      Fragment,
      null,
      elements.map((node) => this.createElementsTree(node))
    )
  }

  createElementsTree(rootElement: TreeElement): ReactElement {
    if (!rootElement.childrenIds.length) {
      return rootElement.element
    }

    const element = cloneElement(
      rootElement.element,
      rootElement.element.props,
      rootElement.childrenIds.map((id) => this.createElementsTree(this.elements[id]))
    )

    return element
  }

  execute(nodes: FileNodesResponse['nodes']) {
    const findParentId = (childrenId: string) =>
      Object.entries(this.elements).find((element) =>
        element[1].childrenIds.includes(childrenId))?.[0] || null

    walk(nodes, (node) => {
      if (isText(node)) {
        this.elements[node.id] = {
          element: this.createTextElement(node),
          childrenIds: [],
          parentId: findParentId(node.id),
        }
      }

      if (isFrame(node)) {
        this.elements[node.id] = {
          element: this.createFrameElement(node),
          childrenIds: node?.children.map((node) => node.id) || [],
          parentId: findParentId(node.id),
        }
      }
    })

    const rootNodes = Object.values(this.elements).filter((element) => !element.parentId)

    const fragment = this.createFragmentElement(rootNodes)

    return format(fragment, {
      plugins: [plugins.ReactElement],
      printFunctionName: false,
    })
  }
}
