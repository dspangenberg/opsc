import { render, screen } from '@testing-library/react'
import React from 'react'
import { FormLabel } from './FormLabel'

describe('FormLabel', () => {
  it('renders with value prop', () => {
    render(<FormLabel value="Test Label" />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders with children', () => {
    render(<FormLabel>Child Label</FormLabel>)
    expect(screen.getByText('Child Label')).toBeInTheDocument()
  })

  it('prioritizes value over children', () => {
    render(<FormLabel value="Value Label">Child Label</FormLabel>)
    expect(screen.getByText('Value Label')).toBeInTheDocument()
    expect(screen.queryByText('Child Label')).not.toBeInTheDocument()
  })

  it('adds required asterisk when required prop is true', () => {
    render(<FormLabel required>Required Label</FormLabel>)
    const labelText = screen.getByText('Required Label')
    const asterisk = screen.getByText('*')
    expect(labelText).toBeInTheDocument()
    expect(asterisk).toBeInTheDocument()
    expect(asterisk).toHaveClass('pl-0.5', 'text-red-600')
  })

  it('handles empty strings', () => {
    render(<FormLabel value="" data-testid="empty-input" />)
    const label = screen.getByTestId('empty-input')
    expect(label).toBeInTheDocument()
    expect(label.textContent).toBe('')
  })

  it('handles long labels', () => {
    const longText = 'a'.repeat(100)
    render(<FormLabel>{longText}</FormLabel>)
    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('escapes special characters', () => {
    render(<FormLabel>{"<script>alert('test')</script>"}</FormLabel>)
    expect(screen.getByText("<script>alert('test')</script>")).toBeInTheDocument()
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })

  it('does not add required asterisk when required prop is false', () => {
    render(<FormLabel>Optional Label</FormLabel>)
    const label = screen.getByText('Optional Label')
    expect(label.nextSibling).toBeNull()
  })

  it('applies custom className', () => {
    render(<FormLabel className="custom-class">Custom Label</FormLabel>)
    expect(screen.getByText('Custom Label')).toHaveClass('custom-class')
  })

  it('passes through other props', () => {
    render(<FormLabel htmlFor="test-input">Test Label</FormLabel>)
    expect(screen.getByText('Test Label')).toHaveAttribute('for', 'test-input')
  })

  it('applies default classes', () => {
    render(<FormLabel>Default Label</FormLabel>)
    expect(screen.getByText('Default Label')).toHaveClass(
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-70',
      'font-normal',
      'text-stone-700',
      'text-sm',
      'leading-none'
    )
  })
})
