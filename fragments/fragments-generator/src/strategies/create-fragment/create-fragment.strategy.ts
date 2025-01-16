import type { FileNodesResponse }   from 'figma-js'
import type { Node }                from 'figma-js'
import type { Attributes }          from 'react'
import type { ReactElement }        from 'react'

import type { CreteFragmentResult } from '../strategies.interfaces.js'
import type { TreeElement }         from '../strategies.interfaces.js'

import { Fragment }                 from 'react'
import { plugins }                  from 'pretty-format'
import { format }                   from 'pretty-format'
import { cloneElement }             from 'react'
import { createElement }            from 'react'
import { v4 as uuid }               from 'uuid'

import { isFrame }                  from '@atls/figma-utils'
import { isText }                   from '@atls/figma-utils'
import { walk }                     from '@atls/figma-utils'

import { CreateBoxStrategy }        from '../create-box/index.js'
import { CreateButtonStrategy }     from '../create-button/index.js'
import { CreateIconStrategy }       from '../create-icon/index.js'
import { CreateImageStrategy }      from '../create-image/index.js'
import { CreateInputStrategy }      from '../create-input/index.js'
import { CreateLinkStrategy }       from '../create-link/index.js'
import { CreateTextStrategy }       from '../create-text/index.js'
import { isButton }                 from './create-fragment.utils.js'
import { isLink }                   from './create-fragment.utils.js'
import { nodeHasImage }             from './create-fragment.utils.js'
import { isIcon }                   from './create-fragment.utils.js'
import { isInput }                  from './create-fragment.utils.js'

export class CreateFragmentStrategy {
  private elements: Record<string, TreeElement> = {}

  private text: CreateTextStrategy

  private box: CreateBoxStrategy

  private icon: CreateIconStrategy

  private image: CreateImageStrategy

  private button = new CreateButtonStrategy()

  private input = new CreateInputStrategy()

  private link = new CreateLinkStrategy()

  constructor(theme: Record<string, Record<string, string>>, images: Record<string, string>) {
    this.text = new CreateTextStrategy(theme)
    this.box = new CreateBoxStrategy(theme)
    this.icon = new CreateIconStrategy(theme)
    this.image = new CreateImageStrategy(images)
  }

  execute(nodes: FileNodesResponse['nodes']): CreteFragmentResult {
    const imports = new Set<string>()
    const ignoreNodes = new Set<string>()

    walk(nodes, (node: Node) => {
      if (ignoreNodes.has(node.id)) {
        return
      }

      if (isIcon(node)) {
        walk(node?.children, (child: Node) => ignoreNodes.add(child.id))

        this.elements[node.id] = {
          element: this.icon.createElement(node),
          childrenIds: [],
          parentId: this.findParentId(node.id),
        }

        this.icon.getImports().forEach((value) => imports.add(value))
      }

      if (isButton(node)) {
        this.button.getImports().forEach((value) => imports.add(value))

        const buttonChildren = new Set<string>()
        walk(node?.children, (child: Node) => buttonChildren.add(child.id))

        this.elements[node.id] = {
          element: this.button.createElement(node),
          childrenIds: Array.from(buttonChildren),
          parentId: this.findParentId(node.id),
        }
      }

      if (isInput(node)) {
        this.input.getImports().forEach((value) => imports.add(value))

        walk(node?.children, (child: Node) => ignoreNodes.add(child.id))

        this.elements[node.id] = {
          element: this.input.createElement(node),
          childrenIds: [],
          parentId: this.findParentId(node.id),
        }
      }

      if (isLink(node)) {
        this.link.getImports().forEach((value) => imports.add(value))

        this.elements[node.id] = {
          element: this.link.createElement(node),
          childrenIds: node?.children.map((child) => child.id) || [],
          parentId: this.findParentId(node.id),
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
          childrenIds: node?.children.map((child) => child.id) || [],
          parentId: this.findParentId(node.id),
        }
      }

      if (nodeHasImage(node)) {
        this.image.getImports().forEach((value) => imports.add(value))

        const imageElements = this.image.createElements(node.background, node.name)

        imageElements.forEach((element) => {
          const elementId = uuid()

          const parentId = this.elements[node.id] ? node.id : this.findParentId(node.id)

          const parentElement = this.elements[node.id] || this.elements[parentId || '']

          parentElement?.childrenIds.push(elementId)

          this.elements[elementId] = {
            element,
            childrenIds: [],
            parentId: parentElement ? parentId : null,
          }
        })
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

  private createFragmentElement(elements: Array<TreeElement>): ReactElement {
    if (elements.length === 0) {
      return createElement(Fragment)
    }

    if (elements.length === 1) {
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
      rootElement.element.props as Partial<Attributes> | undefined,
      rootElement.childrenIds.map((id) =>
        this.elements[id] ? this.createElementsTree(this.elements[id]) : null)
    )

    return element
  }

  private findParentId(childrenId: string): string | null {
    const parentId = Object.entries(this.elements).find((element) =>
      element[1].childrenIds.includes(childrenId))?.[0]

    return parentId || null
  }
}
