import { ReactElement } from 'react'

export interface TreeElement {
  childrenIds: string[]
  parentId: string | null
  element: ReactElement
}
