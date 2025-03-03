import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  const defaultProps = {
    buttonLabel: 'Add Item',
    onClick: vi.fn()
  }

  it('renders children and button', () => {
    render(
      <EmptyState {...defaultProps}>
        <h2>No items found</h2>
        <p>Try adding some items</p>
      </EmptyState>
    )
    expect(screen.getByText('No items found')).toBeInTheDocument()
    expect(screen.getByText('Try adding some items')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', () => {
    render(
      <EmptyState {...defaultProps}>
        <p>No items</p>
      </EmptyState>
    )
    const button = screen.getByRole('button', { name: 'Add Item' })
    fireEvent.click(button)
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1)
  })

  // ... other tests remain the same ...

  it('renders with expected container classes', () => {
    render(
      <EmptyState {...defaultProps}>
        <p>Content</p>
      </EmptyState>
    )
    const container = screen.getByText('Content').closest('div.empty-state-container')
    expect(container).not.toBeNull()

    if (container) {
      expect(container).toHaveClass('py-6')
      expect(container).toHaveClass('w-full')
      expect(container).toHaveClass('flex')
      expect(container).toHaveClass('flex-col')
      expect(container).toHaveClass('justify-center')
      expect(container).toHaveClass('space-y-6')
      expect(container).toHaveClass('items-center')
      expect(container).toHaveClass('text-center')
      expect(container).toHaveClass('rounded-lg')
      expect(container).toHaveClass('text-sm')
      expect(container).toHaveClass('text-muted-foreground')

      console.log('Actual classes:', container.className)
    }
  })

  it('applies additional className when provided', () => {
    const customClass = 'custom-class'
    render(
      <EmptyState {...defaultProps} className={customClass}>
        <p>Content</p>
      </EmptyState>
    )
    const container = screen.getByText('Content').closest('div.empty-state-container')
    expect(container).not.toBeNull()

    if (container) {
      expect(container).toHaveClass(customClass)
      expect(container).toHaveClass('py-6') // Check for a default class as well

      console.log('Actual classes with custom class:', container.className)
    }
  })
})
