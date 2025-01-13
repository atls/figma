import type { FileResponse } from 'figma-js'

import { describe }          from 'node:test'
import { it }                from 'node:test'
import { mock }              from 'node:test'

import { expect }            from 'playwright/test'

import { FigmaFileLoader }   from '@atls/figma-file-loader'
import { FigmaTheme }        from '@atls/figma-theme'

import { run }               from '../run.js'

describe('run', () => {
  it('should load the file and generate the theme', async () => {
    const mockFileResponse = { file: 'mockFile' } as never as FileResponse

    const mockLoad = mock.fn(async () => Promise.resolve(mockFileResponse))
    const mockGenerate = mock.fn(async () => Promise.resolve([]))

    mock.method(FigmaFileLoader.prototype, 'load', mockLoad)
    mock.method(FigmaTheme.prototype, 'generate', mockGenerate)

    const fileId = 'testFileId'
    const output = 'testOutput'
    const ignoredPages = ['page1', 'page2']
    const includedPages = ['page3']
    const prefix = 'testPrefix'
    const method = 'default'

    await run(fileId, output, ignoredPages, includedPages, prefix, method)

    expect(mockLoad.mock.callCount()).toEqual(1)
    expect(mockLoad.mock.calls[0].arguments).toEqual([fileId])
    expect(mockLoad.mock.callCount()).toEqual(1)
  })

  it('should handle errors gracefully', async () => {
    const mockLoad = mock.fn(async () => Promise.reject(new Error('Test Error')))

    mock.method(FigmaFileLoader.prototype, 'load', mockLoad)

    const fileId = 'testFileId'
    const output = 'testOutput'
    const ignoredPages = ['page1', 'page2']
    const includedPages = ['page3']
    const prefix = 'testPrefix'
    const method = 'default'

    const promise = run(fileId, output, ignoredPages, includedPages, prefix, method)

    await expect(promise).rejects.toThrow('Test Error')
  })
})
