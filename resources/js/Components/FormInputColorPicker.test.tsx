import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { FormInputColorPicker } from './FormInputColorPicker'
import { vi } from 'vitest'

describe('FormInputColorPicker', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('renders correctly with initial value', () => {
    render(
      <FormInputColorPicker
        id="color-input"
        label="Color"
        value="#FF0000"
        onChange={mockOnChange}
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('#FF0000')
  })

  it('updates input value when typed', () => {
    render(
      <FormInputColorPicker
        id="color-input"
        label="Color"
        value="#FF0000"
        onChange={mockOnChange}
      />
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '#00FF00' } })
    expect(mockOnChange).toHaveBeenCalledWith('#00FF00')
  })

  // Add more tests as needed
})
