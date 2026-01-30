import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FormCard } from './form-card'

describe('FormCard', () => {
  it('renders children content', () => {
    render(
      <FormCard>
        <div>Test content</div>
      </FormCard>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className to outer container', () => {
    const { container } = render(
      <FormCard className="custom-class">
        <div>Test content</div>
      </FormCard>
    )

    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass('custom-class')
    expect(outerDiv).toHaveClass('flex', 'h-full', 'flex-1', 'flex-col', 'overflow-hidden')
  })

  it('applies innerClassName to ScrollArea component', () => {
    const { container } = render(
      <FormCard innerClassName="inner-custom-class">
        <div>Test content</div>
      </FormCard>
    )

    const scrollArea = container.querySelector('[data-slot="scroll-area"]')
    expect(scrollArea).toHaveClass('inner-custom-class')
    expect(scrollArea).toHaveClass('min-h-0', 'flex-1', 'rounded-md', 'border', 'bg-background')
  })

  it('renders footer when provided', () => {
    render(
      <FormCard footer={<button type="button">Submit</button>}>
        <div>Form content</div>
      </FormCard>
    )

    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('does not render footer when not provided', () => {
    const { container } = render(
      <FormCard>
        <div>Form content</div>
      </FormCard>
    )

    // Check that there's no footer container with the footer-specific classes
    const footerContainer = container.querySelector(
      '.flex.w-full.flex-none.items-center.justify-end'
    )
    expect(footerContainer).not.toBeInTheDocument()
  })

  it('applies className to both outer container and footer when provided', () => {
    const { container } = render(
      <FormCard className="shared-class" footer={<button type="button">Submit</button>}>
        <div>Form content</div>
      </FormCard>
    )

    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass('shared-class')

    const footerContainer = container.querySelector(
      '.flex.w-full.flex-none.items-center.justify-end'
    )
    expect(footerContainer).toHaveClass('shared-class')
  })

  it('renders with correct structure and default classes', () => {
    const { container } = render(
      <FormCard>
        <div>Content</div>
      </FormCard>
    )

    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass('flex', 'h-full', 'flex-1', 'flex-col', 'overflow-hidden')

    const innerContainer = outerDiv?.firstChild as HTMLElement
    expect(innerContainer).toHaveClass(
      'relative',
      'flex',
      'max-h-fit',
      'flex-1',
      'flex-col',
      'gap-1.5',
      'overflow-hidden',
      'rounded-lg',
      'border',
      'border-border/80',
      'bg-page-content',
      'p-1.5'
    )

    const scrollArea = container.querySelector('[data-slot="scroll-area"]')
    expect(scrollArea).toBeInTheDocument()
    expect(scrollArea).toHaveClass('min-h-0', 'flex-1', 'rounded-md', 'border', 'bg-background')
  })

  it('merges className with default classes correctly', () => {
    const { container } = render(
      <FormCard className="test-class">
        <div>Content</div>
      </FormCard>
    )

    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass(
      'flex',
      'h-full',
      'flex-1',
      'flex-col',
      'overflow-hidden',
      'test-class'
    )
  })

  it('merges innerClassName with default ScrollArea classes correctly', () => {
    const { container } = render(
      <FormCard innerClassName="test-inner-class">
        <div>Content</div>
      </FormCard>
    )

    const scrollArea = container.querySelector('[data-slot="scroll-area"]')
    expect(scrollArea).toHaveClass(
      'min-h-0',
      'flex-1',
      'rounded-md',
      'border',
      'bg-background',
      'test-inner-class'
    )
  })
})
