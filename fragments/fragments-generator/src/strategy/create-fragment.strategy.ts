import type { CreteFragmentResult } from './strategy.interfaces.js'
import type { TreeElement }         from './strategy.interfaces.js'
import type { FileNodesResponse }   from 'figma-js'
import type { ReactElement }        from 'react'

import { Fragment }                 from 'react'
import { plugins }                  from 'pretty-format'
import { format }                   from 'pretty-format'
import { cloneElement }             from 'react'
import { createElement }            from 'react'

import { isFrame }                  from '@atls/figma-utils'
import { isInstance }               from '@atls/figma-utils'
import { isText }                   from '@atls/figma-utils'
import { walk }                     from '@atls/figma-utils'

import { CreateBoxStrategy }        from './create-box.strategy.js'
import { CreateButtonStrategy }     from './create-button.strategy.js'
import { CreateTextStrategy }       from './create-text.strategy.js'

export class CreateFragmentStrategy {
  private elements: Record<string, TreeElement> = {}

  private text: CreateTextStrategy
  private box: CreateBoxStrategy
  private button: CreateButtonStrategy

  constructor(theme: Record<string, Record<string, string>>) {
    this.text = new CreateTextStrategy(theme)
    this.box = new CreateBoxStrategy(theme)
    this.button = new CreateButtonStrategy()
  }

  private createFragmentElement(elements: TreeElement[]) {
    if (elements.length <= 1) {
      return this.createElementsTree(elements[0])
    }

    return createElement(
      Fragment,
      null,
      elements.map((node) => this.createElementsTree(node))
    )
  }

  private createElementsTree(rootElement: TreeElement): ReactElement {
    if (!rootElement.childrenIds.length) {
      return rootElement.element
    }

    const element = cloneElement(
      rootElement.element,
      rootElement.element.props,
      rootElement.childrenIds.map((id) =>
        this.elements[id] ? this.createElementsTree(this.elements[id]) : null)
    )

    return element
  }

  private findParentId(childrenId: string) {
    const parentId = Object.entries(this.elements).find((element) =>
      element[1].childrenIds.includes(childrenId))?.[0]

    return parentId || null
  }

  execute(nodes: FileNodesResponse['nodes']): CreteFragmentResult {
    const imports = new Set<string>()

    walk(nodes, (node) => {
      if (isInstance(node)) {
        if (node.name.includes('Button')) {
          this.button.getImports().forEach((value) => imports.add(value))

          const buttonChildren = node?.children.map((node) => node.id) || []
          const buttonDeepChildren = isInstance(node.children[0])
            ? node.children[0].children.map((node) => node.id) || []
            : []

          this.elements[node.id] = {
            element: this.button.createElement(node),
            childrenIds: [...buttonChildren, ...buttonDeepChildren],
            parentId: this.findParentId(node.id),
          }
        }
      }

      if (isText(node)) {
        this.text.getImports().forEach((value) => imports.add(value))

        this.elements[node.id] = {
          element: this.text.createElement(node),
          childrenIds: [],
          parentId: this.findParentId(node.id),
        }
      }

      if (isFrame(node)) {
        this.box.getImports().forEach((value) => imports.add(value))

        this.elements[node.id] = {
          element: this.box.createElement(node),
          childrenIds: node?.children.map((node) => node.id) || [],
          parentId: this.findParentId(node.id),
        }
      }
    })

    const rootNodes = Object.values(this.elements).filter((element) => !element.parentId)

    const fragment = format(this.createFragmentElement(rootNodes), {
      plugins: [plugins.ReactElement],
      printFunctionName: false,
    })

    return {
      fragment,
      imports: Array.from(imports),
    }
  }
}
