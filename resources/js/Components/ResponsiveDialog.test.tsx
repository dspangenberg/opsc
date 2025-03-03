import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ResponsiveDialog } from './ResponsiveDialog'

// Mock the Credenza components
vi.mock('@/Components/ui/credenza', () => ({
  Credenza: ({ children, open, onOpenChange }: any) => (
    <div data-testid="credenza" data-open={open}>
      {children}
      <button type="button" onClick={() => onOpenChange(false)}>Close</button>
    </div>
  ),
  CredenzaContent: ({ children, onInteractOutside, className }: any) => (
    <div 
      data-testid="credenza-content" 
      className={className}
      onClick={() => onInteractOutside?.()}
      onKeyDown={(e) => e.key === 'Enter' && onInteractOutside?.()}
    >
      {children}
    </div>
  ),
  CredenzaHeader: ({ children }: any) => <div data-testid="credenza-header">{children}</div>,
  CredenzaTitle: ({ children }: any) => <h2 data-testid="credenza-title">{children}</h2>,
  CredenzaDescription: ({ children }: any) => children ? <p data-testid="credenza-description">{children}</p> : null,
  CredenzaBody: ({ children }: any) => <div data-testid="credenza-body">{children}</div>,
  CredenzaFooter: ({ children }: any) => <div data-testid="credenza-footer">{children}</div>,
}))

describe('ResponsiveDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Dialog',
    description: 'This is a test dialog',
    children: <p>Dialog content</p>,
    footer: <button type="button">OK</button>,
    onClose: vi.fn(),
    onOpenChange: vi.fn(),
    onInteractOutside: vi.fn(),
  }

  it('renders correctly when open', () => {
    render(<ResponsiveDialog {...defaultProps} />)

    expect(screen.getByTestId('credenza')).toHaveAttribute('data-open', 'true')
    expect(screen.getByTestId('credenza-title')).toHaveTextContent('Test Dialog')
    expect(screen.getByTestId('credenza-description')).toHaveTextContent('This is a test dialog')
    expect(screen.getByText('Dialog content')).toBeInTheDocument()
    expect(screen.getByText('OK')).toBeInTheDocument()
  })

  it('calls onOpenChange when close button is clicked', () => {
    render(<ResponsiveDialog {...defaultProps} />)
    fireEvent.click(screen.getByText('Close'))
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onInteractOutside when clicking outside', () => {
    render(<ResponsiveDialog {...defaultProps} />)
    fireEvent.click(screen.getByTestId('credenza-content'))
    expect(defaultProps.onInteractOutside).toHaveBeenCalledTimes(1)
  })

  it('applies custom className when provided', () => {
    render(<ResponsiveDialog {...defaultProps} className="custom-class" />)
    expect(screen.getByTestId('credenza-content')).toHaveClass('custom-class')
  })

  it('renders without description', () => {
    const propsWithoutDescription = { ...defaultProps, description: undefined }
    render(<ResponsiveDialog {...propsWithoutDescription} />)
    expect(screen.queryByTestId('credenza-description')).not.toBeInTheDocument()
  })
})
