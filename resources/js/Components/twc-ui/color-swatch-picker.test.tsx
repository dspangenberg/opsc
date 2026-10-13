import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ColorSwatchPicker } from '@/Components/twc-ui/color-swatch-picker'
import { FormColorPicker } from '@/Components/twc-ui/form-color-picker'

const COLORS = ['#c42d78', '#3c6dff', '#70c741']

describe('ColorSwatchPicker', () => {
  it('rendert einen Swatch pro Farbe', () => {
    render(<ColorSwatchPicker label="Farbe" colors={COLORS} />)

    expect(screen.getByText('Farbe:')).toBeInTheDocument()
    const swatches = document.querySelectorAll('[role="img"][aria-roledescription="color swatch"]')
    expect(swatches).toHaveLength(COLORS.length)
  })

  it('markiert den aktuell ausgewählten Wert', () => {
    render(<ColorSwatchPicker label="Farbe" colors={COLORS} value="#3c6dff" />)

    const selected = document.querySelector('[data-selected="true"]')
    expect(selected).not.toBeNull()
  })

  it('übermittelt die gewählte Farbe als lowercase Hex-String', () => {
    const onChange = vi.fn()
    render(<ColorSwatchPicker label="Farbe" colors={COLORS} onChange={onChange} />)

    const options = document.querySelectorAll('[role="option"]')
    fireEvent.click(options[2])

    expect(onChange).toHaveBeenCalledWith('#70c741')
  })
})

describe('FormColorPicker', () => {
  it('zeigt die übergebene Fehlermeldung an', () => {
    render(<FormColorPicker label="Farbe" colors={COLORS} errorMessage="Bitte wählen" />)

    expect(screen.getByText('Bitte wählen')).toBeInTheDocument()
  })

  it('leitet Wert und onChange an den Picker weiter', () => {
    const onChange = vi.fn()
    render(<FormColorPicker label="Farbe" colors={COLORS} value="#3c6dff" onChange={onChange} />)

    const selected = document.querySelector('[data-selected="true"]')
    expect(selected).not.toBeNull()

    const options = document.querySelectorAll('[role="option"]')
    fireEvent.click(options[0])
    expect(onChange).toHaveBeenCalledWith('#c42d78')
  })
})
