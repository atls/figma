import { FigmaFileLoader } from '@atls/figma-file-loader'
import { FigmaTheme }      from '@atls/figma-theme'

import { run }             from '../run.js'

jest.mock('@atls/figma-file-loader')
jest.mock('@atls/figma-theme')

describe('run', () => {
  it('should load the file and generate the theme', async () => {
    const mockFileResponse = { file: 'mockFile' }
    const mockLoad = jest.fn().mockResolvedValue(mockFileResponse)
    const mockGenerate = jest.fn()

    ;(FigmaFileLoader as jest.Mock).mockImplementation(() => ({
      load: mockLoad,
    }))
    ;(FigmaTheme as jest.Mock).mockImplementation(() => ({
      generate: mockGenerate,
    }))

    const fileId = 'testFileId'
    const output = 'testOutput'
    const ignoredPages = ['page1', 'page2']
    const includedPages = ['page3']
    const prefix = 'testPrefix'
    const method = 'default'

    await run(fileId, output, ignoredPages, includedPages, prefix, method)

    expect(mockLoad).toHaveBeenCalledWith(fileId)
    expect(FigmaTheme).toHaveBeenCalledWith(
      mockFileResponse,
      output,
      ignoredPages,
      includedPages,
      prefix
    )
    expect(mockGenerate).toHaveBeenCalled()
  })

  it('should handle errors gracefully', async () => {
    const mockLoad = jest.fn().mockRejectedValue(new Error('Test Error'))

    ;(FigmaFileLoader as jest.Mock).mockImplementation(() => ({
      load: mockLoad,
    }))

    const fileId = 'testFileId'
    const output = 'testOutput'
    const ignoredPages = ['page1', 'page2']
    const includedPages = ['page3']
    const prefix = 'testPrefix'
    const method = 'default'

    await expect(run(fileId, output, ignoredPages, includedPages, prefix, method)).rejects.toThrow(
      'Test Error'
    )
  })
})
