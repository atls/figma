import { FileResponse } from 'figma-js'

export interface FigmaThemeGeneratorValues {
  content: string
  name: string
}

export type FigmaThemeGeneratorResult =
  | FigmaThemeGeneratorValues
  | Promise<FigmaThemeGeneratorValues>

export abstract class FigmaThemeGenerator {
  exportValuesTemplate(name: string, values: any): string {
    return `export const ${name} = ${JSON.stringify(values, null, 4)}`
  }

  abstract generate(file: FileResponse): FigmaThemeGeneratorResult
}
