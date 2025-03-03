import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { FormRadioGroup } from './FormRadioGroup'

describe('FormRadioGroup', () => {
  const options = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' },
    { id: 3, name: 'Option 3' }
  ]

  it('renders all options', () => {
    render(<FormRadioGroup options={options} value={1} onValueChange={() => {}} />)

    for (const option of options) {
      expect(screen.getByLabelText(option.name)).toBeInTheDocument()
    }
  })

  it('selects the correct option based on value prop', () => {
    render(<FormRadioGroup options={options} value={2} onValueChange={() => {}} />)

    const selectedOption = screen.getByLabelText('Option 2')
    expect(selectedOption).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onValueChange when an option is selected', () => {
    const mockOnValueChange = vi.fn()
    render(<FormRadioGroup options={options} value={1} onValueChange={mockOnValueChange} />)

    fireEvent.click(screen.getByLabelText('Option 3'))
    expect(mockOnValueChange).toHaveBeenCalledWith(3)
  })

  it('applies custom className when provided', () => {
    render(
      <FormRadioGroup
        options={options}
        value={1}
        onValueChange={() => {}}
        className="custom-class"
      />
    )

    const radioGroup = screen.getByRole('radiogroup')
    expect(radioGroup).toHaveClass('custom-class')
  })
})
