import { ReactElement } from 'react'

export interface TreeElement {
  childrenIds: Array<string>
  parentId: string | null
  element: ReactElement
}

export interface CreteFragmentResult {
  fragment: string
  imports: Array<string>
}
