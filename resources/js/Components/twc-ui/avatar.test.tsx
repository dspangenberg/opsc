import { act, render, screen } from '@testing-library/react'
import { Avatar } from '@/Components/twc-ui/avatar'

class MockImage {
  static instances: MockImage[] = []

  complete = false
  naturalWidth = 0
  src = ''

  private listeners: Record<string, ((event?: unknown) => void) | undefined> = {}

  constructor() {
    MockImage.instances.push(this)
  }

  addEventListener(event: string, handler: (event?: unknown) => void) {
    this.listeners[event] = handler
  }

  removeEventListener(event: string) {
    delete this.listeners[event]
  }

  fireError() {
    this.complete = true
    this.listeners['error']?.()
  }

  fireLoad() {
    this.complete = true
    this.naturalWidth = 100
    this.listeners['load']?.({ currentTarget: this })
  }
}

const NativeImage = window.Image

beforeEach(() => {
  MockImage.instances = []
  window.Image = MockImage as unknown as typeof Image
})

afterEach(() => {
  window.Image = NativeImage
})

describe('Avatar', () => {
  it('zeigt das Fallback mit generiertem Hintergrund, wenn kein src übergeben wird', async () => {
    render(<Avatar fullname="Max Mustermann" initials="MM" />)

    const fallback = await screen.findByText('MM')
    expect(fallback.style.backgroundColor).not.toBe('')
    expect(fallback.style.color).not.toBe('')
  })

  it('zeigt das Fallback mit generiertem Hintergrund, wenn das Bild nicht gefunden wird', async () => {
    render(<Avatar fullname="Max Mustermann" initials="MM" src="https://example.com/missing.png" />)

    act(() => {
      MockImage.instances[0]?.fireError()
    })

    const fallback = await screen.findByText('MM')
    expect(fallback).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(fallback.style.backgroundColor).not.toBe('')
    expect(fallback.style.color).not.toBe('')
  })

  it('rendert das Bild und versteckt das Fallback, wenn das Bild geladen wird', async () => {
    render(<Avatar fullname="Max Mustermann" initials="MM" src="https://example.com/avatar.png" />)

    act(() => {
      MockImage.instances[0]?.fireLoad()
    })

    const img = await screen.findByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
    expect(screen.queryByText('MM')).not.toBeInTheDocument()
  })
})
