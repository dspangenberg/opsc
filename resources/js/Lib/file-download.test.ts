import { describe, expect, it } from 'vitest'

import { extractFilenameFromContentDisposition, extractFilenameFromUrl } from './file-download'

describe('extractFilenameFromContentDisposition', () => {
  it('returns undefined when no header is present', () => {
    expect(extractFilenameFromContentDisposition()).toBeUndefined()
  })

  it('extracts the filename when present', () => {
    expect(
      extractFilenameFromContentDisposition('inline; filename="report.pdf"')
    ).toBe('report.pdf')
  })

  it('extracts the filename without quotes', () => {
    expect(extractFilenameFromContentDisposition('attachment; filename=report.pdf')).toBe('report.pdf')
  })
})

describe('extractFilenameFromUrl', () => {
  it('returns the last path segment', () => {
    expect(extractFilenameFromUrl('https://example.test/files/report.pdf')).toBe('report.pdf')
  })

  it('returns fallback when the path is empty', () => {
    expect(extractFilenameFromUrl('https://example.test/', 'fallback.pdf')).toBe('fallback.pdf')
  })
})
