import { render, screen } from '@testing-library/react'
import React from 'react'
import { FormErrors } from './FormErrors'
import '@testing-library/jest-dom'
vi.mock('@hugeicons/react', () => ({
  Alert02Icon: () => <div data-testid="mock-alert-icon" />
}))

describe('FormErrors', () => {
  it('renders nothing when there are no errors', () => {
    const { container } = render(<FormErrors errors={{}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders with default title when errors are present', () => {
    const errors = { field1: 'Error 1', field2: 'Error 2' }
    render(<FormErrors errors={errors} />)

    expect(screen.getByText('Das hat leider nicht funktioniert.')).toBeInTheDocument()
  })

  it('renders with custom title when provided', () => {
    const errors = { field1: 'Error 1' }
    const customTitle = 'Custom Error Title'
    render(<FormErrors errors={errors} title={customTitle} />)

    expect(screen.getByText(customTitle)).toBeInTheDocument()
  })

  it('renders all error messages', () => {
    const errors = { field1: 'Error 1', field2: 'Error 2', field3: 'Error 3' }
    render(<FormErrors errors={errors} />)

    expect(screen.getByText('Error 1')).toBeInTheDocument()
    expect(screen.getByText('Error 2')).toBeInTheDocument()
    expect(screen.getByText('Error 3')).toBeInTheDocument()
  })

  it('renders the Alert02Icon', () => {
    const errors = { field1: 'Error 1' }
    render(<FormErrors errors={errors} />)

    expect(screen.getByTestId('mock-alert-icon')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const errors = { field1: 'Error 1' }
    render(<FormErrors errors={errors} />)

    const errorContainer = screen.getByRole('alert')
    expect(errorContainer).toHaveClass(
      'rounded-lg',
      'border',
      'border-red-500/50',
      'px-4',
      'py-3',
      'text-red-600'
    )
  })

  it('renders error messages in a list', () => {
    const errors = { field1: 'Error 1', field2: 'Error 2' }
    render(<FormErrors errors={errors} />)

    const errorList = screen.getByRole('list')
    expect(errorList).toBeInTheDocument()
    expect(errorList.children.length).toBe(2)
  })
})
