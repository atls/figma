import { FileResponse } from 'figma-js'

export interface FigmaThemeGeneratorValues {
  name: string
  content: string
}

export type FigmaThemeGeneratorResult =
  | FigmaThemeGeneratorValues
  | Promise<FigmaThemeGeneratorValues>

export abstract class FigmaThemeGenerator {
  method: 'default' | 'secondary'

  constructor(method: 'default' | 'secondary' = 'default') {
    this.method = method
  }

  exportValuesTemplate(name: string, values: any): string {
    return `export const ${name} = ${JSON.stringify(values, null, 4)}`
  }

  abstract generate(file: FileResponse): FigmaThemeGeneratorResult
}
