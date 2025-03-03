/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { FormGroup } from './FormGroup'

describe('FormGroup', () => {
  it('renders children correctly', () => {
    render(
      <FormGroup>
        <div data-testid="child">Child content</div>
      </FormGroup>
    )
    expect(screen.getByTestId('child')).toHaveTextContent('Child content')
  })

  it('renders title when provided', () => {
    render(<FormGroup title="Test Title">Content</FormGroup>)
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('does not render title when not provided', () => {
    const { container } = render(<FormGroup>Content</FormGroup>)
    expect(container.querySelector('.font-medium')).not.toBeInTheDocument()
  })

  it('applies border class when border prop is true', () => {
    const { container } = render(<FormGroup border>Content</FormGroup>)
    expect(container.firstChild).toHaveClass('border-stone-100')
  })

  it('applies correct grid class based on cols prop', () => {
    const { container } = render(<FormGroup cols={12}>Content</FormGroup>)
    expect(container.firstChild?.lastChild).toHaveClass('grid-cols-12')
  })

  it('applies grid classes when grid prop is true', () => {
    const { container } = render(<FormGroup grid>Content</FormGroup>)
    expect(container.firstChild?.lastChild).toHaveClass('grid', 'gap-x-3', 'gap-y-3')
  })

  it('applies margin class when margin prop is true', () => {
    const { container } = render(<FormGroup margin>Content</FormGroup>)
    expect(container.firstChild?.lastChild).toHaveClass('mt-3')
  })

  it('applies custom className when provided', () => {
    const { container } = render(<FormGroup className="custom-class">Content</FormGroup>)
    expect(container.firstChild?.lastChild).toHaveClass('custom-class')
  })

  it('applies custom titleClass when provided', () => {
    render(
      <FormGroup title="Test" titleClass="custom-title-class">
        Content
      </FormGroup>
    )
    expect(screen.getByText('Test')).toHaveClass('custom-title-class')
  })
})
