import type * as React from 'react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { FormDateRangePicker } from '@/Components/FormDateRangePicker'

import { Button, FormErrors, FormGroup } from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import { router } from '@inertiajs/react'
import { format, parse } from 'date-fns'
import {CalendarDate} from '@internationalized/date'
import { Input, JollyTextField } from '@/Components/jolly-ui/textfield'
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/Components/jolly-ui/dialog'
import { JollyNumberField } from '@/Components/jolly-ui/numberfield'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'


interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditLineDialog: React.FC<Props> = ({
  invoice,
  invoiceLine
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.invoice.details', { invoice: invoice.id }))
  }

  const { data, errors, updateAndValidate, submit, updateAndValidateWithoutEvent } =
    useForm<App.Data.InvoiceLineData>(
      'put',
      route('app.invoice.line-update', {
        invoice: invoice.id,
        invoiceLine: invoiceLine.id
      }),
      invoiceLine
    )

  const handleValueChange = (name: keyof App.Data.InvoiceLineData, value: number) => {
    console.log(value)
    updateAndValidateWithoutEvent(name, value)
  }

  const handleTextChange =
    (name: keyof App.Data.InvoiceLineData) => (value: string | undefined) => {
      console.log(value)
      updateAndValidateWithoutEvent(name, value || '')
    }

  const handleNumberInputChange =
    (name: keyof App.Data.InvoiceLineData) => (value: number | undefined) => {
      updateAndValidateWithoutEvent(name, value ?? null)
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
      handleClose()
    } catch (error) {}
  }

  const handlePeriodChange = (range: { from: string; to: string }) => {
    updateAndValidateWithoutEvent('service_period_begin', range.from)
    updateAndValidateWithoutEvent('service_period_end', range.to)
  }


  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle>Rechnungsposition bearbeiten</DialogTitle>
        </DialogHeader>


        <DialogBody>
          <form onSubmit={handleSubmit} id="invoiceLineForm">
            <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-3">
                <JollyNumberField
                  autoFocus
                  formatOptions={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                  label="Menge"
                  value={data.quantity as unknown as number}
                  isInvalid={!!errors.quantity || false}
                  onChange={handleNumberInputChange('quantity')}
                />
              </div>
              <div className="col-span-2">
                <JollyTextField
                  name="unit"
                  label="Einheit"
                  className="pointer-events-auto"
                  value={data.unit as unknown as string}
                  onChange={handleTextChange('unit')}
                  isInvalid={!!errors.unit || false}
                />
              </div>
              <div className="col-span-11">
                <JollyTextField
                  name="text"
                  label="Beschreibung"
                  textArea={true}
                  value={data.text}
                  isInvalid={!!errors.text || false}
                  onChange={value => handleTextChange('text')(value)}
                />
              </div>
              <div className="col-span-4">
                <JollyNumberField
                  formatOptions={{
                    style: 'currency',
                    currency: 'EUR'
                  }}
                  label="Einzelpreis"
                  value={data.price as unknown as number}
                  onChange={handleNumberInputChange('price')}
                />
              </div>
              <div className="col-span-4">
                <JollyNumberField
                  formatOptions={{
                    style: 'currency',
                    currency: 'EUR'
                  }}
                  label="Gesamtbetrag"
                  value={data.amount as unknown as number}
                  isDisabled={data.type_id === 1}
                  onChange={handleNumberInputChange('amount')}
                />
              </div>
              <div className="col-span-5" />
              <div className="col-span-11">
                x
              </div>
              <div className="col-span-4">
                <JollySelect<App.Data.TaxRateData>
                  onSelectionChange={selected =>
                    handleValueChange('tax_rate_id', selected as unknown as number)
                  }
                  selectedKey={data.tax_rate_id}
                  label="USt.-Satz"
                  items={invoice.tax?.rates || []}
                >
                  {item => <SelectItem>{item.name}</SelectItem>}
                </JollySelect>
              </div>
            </FormGroup>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
          <Button form="invoiceLineForm" type="submit">
            Speichern
          </Button>
        </DialogFooter>

      </DialogContent>
    </DialogOverlay>
  )
}
