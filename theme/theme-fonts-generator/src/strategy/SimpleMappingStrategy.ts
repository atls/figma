import type { Text } from 'figma-js'

import { Fonts }     from '../Constants.js'
import { Strategy }  from './Strategy.js'

export class SimpleMappingStrategy extends Strategy {
  fillFonts(fonts: Array<string>): object {
    return fonts.reduce(
      (result, font, index) => ({
        ...result,
        [Fonts[index] || font.replace(/ /g, '')]: font,
      }),
      {}
    )
  }

  execute(textNodes: Array<Text> = []): object {
    const stat = this.getStat(textNodes)

    const sortedFonts = Array.from(stat.entries())
      .sort((a, b) => a[1] - b[1])
      .reverse()

    const fonts = sortedFonts.map((item) => item[0])

    return {
      ...this.fillFonts(fonts),
    }
  }
}
