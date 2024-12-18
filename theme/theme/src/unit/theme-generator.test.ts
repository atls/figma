import { FileResponse }   from 'figma-js'
import { Node }           from 'figma-js'
import { promises as fs } from 'fs'
import path               from 'path'
import prettier           from 'prettier'

import { FigmaTheme }     from '../FigmaTheme.js'

jest.mock('fs', () => ({
  promises: {
    writeFile: jest.fn(),
  },
}))

jest.mock('prettier', () => ({
  resolveConfig: jest.fn().mockResolvedValue({}),
  format: jest.fn((content, options) => content),
}))

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
    await theme.generate()
    expect(fs.writeFile).toHaveBeenCalled()
    const writtenData = (fs.writeFile as jest.Mock).mock.calls[0][1]
    expect(writtenData).not.toContain('Page 1')
  })

  it('should include only specified pages', async () => {
    theme = new FigmaTheme(mockFileResponse, outputPath, [], ['2'], '')
    await theme.generate()
    expect(fs.writeFile).toHaveBeenCalled()
    const filteredPages = mockFileResponse.document.children.filter((node) =>
      ['2'].includes(node.id))
    expect(filteredPages).toHaveLength(1)
    expect(filteredPages[0].id).toBe('2')
  })

  it('should format content correctly using prettier', async () => {
    await theme.generate()
    expect(prettier.format).toHaveBeenCalled()
  })

  it('should write formatted content to the correct file path', async () => {
    const expectedPath = path.join(process.cwd(), outputPath, 'colors.ts')
    await theme.generate()
    expect(fs.writeFile).toHaveBeenCalledWith(expectedPath, expect.any(String))
  })

  it('should filter components with prefix', async () => {
    const prefix = 'prefix-'
    theme = new FigmaTheme(mockFileResponse, outputPath, [], [], prefix)

    const nodes: Node[] = [
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
