import type { ReactElement } from 'react'
import { describe, expect, it, vi } from 'vitest'

let renderedElement: ReactElement | null = null
const render = vi.fn((element: ReactElement) => {
  renderedElement = element
})
const unmount = vi.fn()

vi.mock('react-dom/client', () => ({
  createRoot: () => ({
    render,
    unmount
  })
}))

describe('InvoiceReportDialog.call', () => {
  it('resolves with range and withPayments when confirmed', async () => {
    vi.useFakeTimers()
    const { InvoiceReportDialog } = await import('./InvoiceReportDialog')
    const promise = InvoiceReportDialog.call()

    expect(renderedElement).not.toBeNull()

    const props = (renderedElement as ReactElement).props as {
      onConfirm: (range: unknown, withPayments: boolean) => void
    }

    props.onConfirm(null, true)

    await expect(promise).resolves.toEqual({ range: null, withPayments: true })

    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })
})
