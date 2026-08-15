import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { App } from '@inertiajs/react'
import { ApplicationProvider } from '@/Components/ApplicationProvider'
import { BreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import EmailIndex from './EmailIndex'

const unreadMail = {
  id: 1,
  subject: 'Unread Mail',
  from: 'a@b.c',
  to: [],
  body: 'E-Mail Body',
  date: '15.08.2026 12:00',
  seen_at: null,
  attachments_count: 0
}

const initialPage = {
  component: 'App/Email/EmailIndex',
  props: {
    auth: { user: { id: 1 }, dropboxes: [] },
    mails: { data: [unreadMail], to: 1, total: 1 },
    mail: null,
    dropbox: { id: 5, name: 'Dropbox', email_address: 'info@test.test', is_shared: false },
    contacts: [],
    projects: []
  },
  url: '/app/emails/5',
  version: '1',
  scrollProps: {
    mails: { pageName: 'page', previousPage: null, nextPage: null, currentPage: 1, reset: false }
  }
}

type FakeXHRInstance = {
  url: string
  headers: Record<string, string>
  status: number
  responseText: string
  onload: (() => void) | null
  onerror: (() => void) | null
  onabort: (() => void) | null
  upload: { onprogress: (() => void) | null }
}

class FakeXMLHttpRequest {
  static instances: FakeXHRInstance[] = []

  url = ''
  headers: Record<string, string> = {}
  status = 200
  responseText = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  onabort: (() => void) | null = null
  upload = { onprogress: null as (() => void) | null }

  open(_method: string, url: string): void {
    this.url = url
  }

  setRequestHeader(key: string, value: string): void {
    this.headers[key.toLowerCase()] = value
  }

  getAllResponseHeaders(): string {
    return 'content-type: application/json\r\nx-inertia: true\r\n'
  }

  abort(): void {
    if (this.onabort) this.onabort()
  }

  send(): void {
    FakeXMLHttpRequest.instances.push(this)
    queueMicrotask(() => {
      const partialData = this.headers['x-inertia-partial-data'] ?? ''

      let payload: Record<string, unknown>
      if (partialData === 'mail') {
        payload = {
          component: 'App/Email/EmailIndex',
          props: { mail: { ...unreadMail, seen_at: '2026-08-15T12:00:00Z' } },
          url: this.url,
          version: '1'
        }
      } else {
        payload = initialPage as unknown as Record<string, unknown>
      }

      this.responseText = JSON.stringify(payload)
      this.status = 200
      if (this.onload) this.onload()
    })
  }
}

function routeMock(name: string, params?: Record<string, unknown>): string {
  const p = (params ?? {}) as Record<string, unknown>
  const dropbox = p.dropbox as number
  const mail = p.mail as number | undefined
  let url = `/app/emails/${dropbox}`
  if (mail !== undefined) url += `/${mail}`
  return url
}

;(globalThis as Record<string, unknown>).route = ((name: string, params?: Record<string, unknown>) => {
  const url = routeMock(name, params)
  const route = (() => url) as unknown as { params: Record<string, string | number | null> }
  route.params = { view: null }
  ;(route as unknown as { toString: () => string }).toString = () => url
  return route
}) as unknown as typeof routeMock

;(globalThis as Record<string, unknown>).XMLHttpRequest = FakeXMLHttpRequest

describe('EmailIndex unread indicator', () => {
  beforeEach(() => {
    cleanup()
    ;(IntersectionObserver as unknown as { instances: unknown[] }).instances = []
    FakeXMLHttpRequest.instances = []

    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get() {
        return {}
      }
    })
  })

  afterEach(() => {
    FakeXMLHttpRequest.instances = []
  })

  it('clears the unread indicator when opening an unread email', async () => {
    render(
      <ApplicationProvider>
        <BreadcrumbProvider>
          <App
            initialPage={initialPage as never}
            initialComponent={EmailIndex}
            resolveComponent={() => Promise.resolve(EmailIndex)}
            titleCallback={() => ''}
            onHeadUpdate={() => {}}
          />
        </BreadcrumbProvider>
      </ApplicationProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Unread Mail')).toBeInTheDocument()
    })

    const button = screen.getByText('Unread Mail').closest('button')!
    expect(button).not.toBeNull()
    const row = button.parentElement!
    const unreadDot = () => row.querySelector('span.size-2.rounded-full.bg-primary')

    expect(unreadDot()).not.toBeNull()

    act(() => {
      fireEvent.click(button)
    })

    await waitFor(() => {
      expect(unreadDot()).toBeNull()
    }, { timeout: 5000 })
  }, 15000)
})
