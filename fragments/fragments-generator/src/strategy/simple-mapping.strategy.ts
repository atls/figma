import { Text }          from 'figma-js'
import { plugins }       from 'pretty-format'
import { format }        from 'pretty-format'
import { createElement } from 'react'

export class SimpleMappingStrategy {
  execute(textNodes: Text[] = []) {
    const { name, style } = textNodes[0]

    const element = createElement(
      'Text',
      {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
      },
      name
    )

    return format(element, {
      plugins: [plugins.ReactElement],
      printFunctionName: false,
    })
  }
}
