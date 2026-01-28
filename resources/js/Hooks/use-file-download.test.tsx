import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useFileDownload } from './use-file-download'

const mockFetch = vi.fn()

describe('useFileDownload', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockFetch.mockReset()

    vi.stubGlobal('fetch', mockFetch)
    vi.stubGlobal('URL', {
      ...globalThis.URL,
      createObjectURL: vi.fn(() => 'blob:mock'),
      revokeObjectURL: vi.fn()
    })

    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    mockFetch.mockResolvedValue({
      headers: {
        get: () => null
      },
      blob: async () => new Blob(['test'])
    })
  })

  it('uses the default route when no override is provided', async () => {
    const { result } = renderHook(() => useFileDownload({ route: '/download', filename: 'file.pdf' }))

    await result.current.handleDownload()

    expect(mockFetch).toHaveBeenCalledWith('/download')
  })

  it('uses the override route when provided', async () => {
    const { result } = renderHook(() => useFileDownload())

    await result.current.handleDownload('/override', 'override.pdf')

    expect(mockFetch).toHaveBeenCalledWith('/override')
  })
})
