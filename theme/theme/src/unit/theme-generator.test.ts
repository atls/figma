import type { FileResponse } from 'figma-js'
import type { Node }         from 'figma-js'

import { describe }          from 'node:test'
import { beforeEach }        from 'node:test'
import { it }                from 'node:test'
import { mock }              from 'node:test'

import { promises as fs }    from 'fs'
import { expect }            from 'playwright/test'
import path                  from 'path'
import prettier              from 'prettier'

import { FigmaTheme }        from '../FigmaTheme.js'

const mockFileResponse: FileResponse = {
  document: {
    children: [
      {
        id: '1',
        name: 'Page 1',
        type: 'CANVAS',
        children: [],
        backgroundColor: { r: 1, g: 2, b: 0, a: 0 },
        prototypeStartNodeID: '1',
      },
      {
        id: '2',
        name: 'Page 2',
        type: 'CANVAS',
        children: [],
        backgroundColor: { r: 1, g: 2, b: 0, a: 0 },
        prototypeStartNodeID: '2',
      },
    ],
    id: 'document',
    name: 'Test Document',
    type: 'DOCUMENT',
  },
  components: {},
  role: 'editor',
  styles: {},
  lastModified: '',
  name: 'Test File',
  schemaVersion: 0,
  thumbnailUrl: '',
  version: '',
}

describe('FigmaTheme', () => {
  let theme: FigmaTheme
  let outputPath: string

  beforeEach(() => {
    outputPath = 'theme'
    theme = new FigmaTheme(mockFileResponse, outputPath, [], [], '')
  })

  it('should filter ignored pages', async () => {
    theme = new FigmaTheme(mockFileResponse, outputPath, ['1'], [], '')

    const mockWriteFile = mock.fn()
    mock.method(fs, 'writeFile', mockWriteFile)

    await theme.generate()
    expect(mockWriteFile.mock.callCount()).toBeTruthy()
    const writtenData = mockWriteFile.mock.calls[0].arguments[1]
    expect(writtenData).not.toContain('Page 1')
  })

  it('should include only specified pages', async () => {
    theme = new FigmaTheme(mockFileResponse, outputPath, [], ['2'], '')

    const mockWriteFile = mock.fn()
    mock.method(fs, 'writeFile', mockWriteFile)

    await theme.generate()
    expect(mockWriteFile.mock.callCount()).toBeTruthy()
    const filteredPages = mockFileResponse.document.children.filter((node) =>
      ['2'].includes(node.id))
    expect(filteredPages).toHaveLength(1)
    expect(filteredPages[0].id).toBe('2')
  })

  it('should format content correctly using prettier', async () => {
    const mockFormat = mock.fn()
    mock.method(prettier, 'format', mockFormat)

    await theme.generate()
    expect(mockFormat.mock.callCount()).toBeTruthy()
  })

  it('should write formatted content to the correct file path', async () => {
    const expectedPath = path.join(process.cwd(), outputPath, 'colors.ts')

    const mockWriteFile = mock.fn()
    mock.method(fs, 'writeFile', mockWriteFile)

    await theme.generate()

    expect(mockWriteFile.mock.callCount()).toBeTruthy()
    expect(mockWriteFile.mock.calls[1].arguments).toEqual([expectedPath, undefined])
  })

  it('should filter components with prefix', async () => {
    const prefix = 'prefix-'
    theme = new FigmaTheme(mockFileResponse, outputPath, [], [], prefix)

    const nodes: Array<Node> = [
      {
        id: '1',
        name: 'prefix-Component-1',
        type: 'COMPONENT',
        children: [],
        absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
        backgroundColor: { r: 1, g: 1, b: 1, a: 1 },
        fills: [],
        strokes: [],
        exportSettings: [],
        blendMode: 'PASS_THROUGH',
        constraints: { vertical: 'TOP', horizontal: 'LEFT' },
        effects: [],
        cornerRadius: 0,
        background: [],
        clipsContent: false,
        strokeAlign: 'CENTER',
        strokeWeight: 2,
      },
      {
        id: '1',
        name: 'Component-2',
        type: 'COMPONENT',
        children: [],
        absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
        backgroundColor: { r: 1, g: 1, b: 1, a: 1 },
        fills: [],
        strokes: [],
        exportSettings: [],
        blendMode: 'PASS_THROUGH',
        constraints: { vertical: 'TOP', horizontal: 'LEFT' },
        effects: [],
        cornerRadius: 0,
        background: [],
        clipsContent: false,
        strokeAlign: 'CENTER',
        strokeWeight: 2,
      },
    ]

    // eslint-disable-next-line dot-notation
    const result = theme['getComponentsWithPrefix'](nodes, prefix)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('prefix-Component-1')
  })
})
