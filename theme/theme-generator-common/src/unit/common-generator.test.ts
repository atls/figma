import type { FileResponse }              from 'figma-js'

import type { FigmaThemeGeneratorResult } from '../index.js'

import { describe }                       from 'node:test'
import { beforeEach }                     from 'node:test'
import { it }                             from 'node:test'

import { expect }                         from 'playwright/test'

import { FigmaThemeGenerator }            from '../index.js'

class TestGenerator extends FigmaThemeGenerator {
  generate(file: FileResponse): FigmaThemeGeneratorResult {
    const values = { testKey: 'testValue' }
    return {
      name: 'test',
      content: this.exportValuesTemplate('test', values),
    }
  }
}

describe('FigmaThemeGenerator', () => {
  let generator: TestGenerator

  beforeEach(() => {
    generator = new TestGenerator()
  })

  it('should format values correctly using exportValuesTemplate', () => {
    const values = { key: 'value' }
    const result = generator.exportValuesTemplate('test', values)
    expect(result).toBe('export const test = {\n    "key": "value"\n}')
  })

  it('should generate correct result for given file', () => {
    const file: FileResponse = {
      components: {},
      role: 'editor',
      styles: {},
      document: {
        children: [],
        id: '1',
        name: 'Test Document',
        type: 'DOCUMENT',
      },
      lastModified: '',
      name: '',
      schemaVersion: 0,
      thumbnailUrl: '',
      version: '',
    }
    const result = generator.generate(file)
    expect(result).toEqual({
      name: 'test',
      content: 'export const test = {\n    "testKey": "testValue"\n}',
    })
  })
})
