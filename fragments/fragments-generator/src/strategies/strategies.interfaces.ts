import type { ReactElement } from 'react'

export interface TreeElement {
  childrenIds: Array<string>
  parentId: string | null
  element: ReactElement
}

export interface CreteFragmentResult {
  fragment: string
  imports: Array<string>
}

export interface ComponentProperty {
  type: 'COMPONENT_SET' | 'COMPONENT'
  value: boolean | string
}

export type ComponentProperties = Record<string, ComponentProperty>
