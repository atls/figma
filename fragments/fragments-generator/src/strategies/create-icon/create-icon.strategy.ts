import type { Instance }        from 'figma-js'
import type { Vector }          from 'figma-js'
import type { Node }            from 'figma-js'
import type { ReactElement }    from 'react'

import React                    from 'react'
import camelcase                from 'camelcase'

import { ThemeMappingStrategy } from '../theme-mapping/index.js'

export class CreateIconStrategy extends ThemeMappingStrategy {
  private iconName = 'Icon'

  getImports(): Array<string> {
    return [`import { ${this.iconName} } from '@ui/icon'`]
  }

  createElement({ absoluteBoundingBox, name, children }: Instance): ReactElement {
    const fills = this.getChildWithFills(children)?.fills

    this.iconName = this.createIconName(name)

    return React.createElement(this.iconName, {
      color: fills ? this.getColor(fills) : undefined,
      width: absoluteBoundingBox.width ? `${absoluteBoundingBox.width}px` : undefined,
      height: absoluteBoundingBox.height ? `${absoluteBoundingBox.height}px` : undefined,
    })
  }

  private getChildWithFills(children: ReadonlyArray<Node>): Vector | undefined {
    const child = children.find((item) => item.type === 'VECTOR' && item.fills?.length)

    return child && child.type === 'VECTOR' ? child : undefined
  }

  private createIconName(nodeName: string): string {
    return `${camelcase(nodeName, { pascalCase: true }).replace('50+', 'FiftyPlus')}Icon`
  }
}
