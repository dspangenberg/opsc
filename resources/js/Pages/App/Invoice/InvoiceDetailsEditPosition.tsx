import { createCallable } from 'react-call'
import type * as React from 'react'
import { type FormEvent, useEffect, useState } from 'react'
import { FormErrors, FormGroup } from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import { FormDateRangePicker } from '@/Components/FormDateRangePicker'
import { JollyNumberField } from '@/Components/jolly-ui/numberfield'
import { JollyTextField, Input } from '@/Components/jolly-ui/textfield'
import { format, parse } from 'date-fns'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'
import { Button } from '@/Components/jolly-ui/button'
import { DialogContent, DialogHeader, DialogFooter, DialogOverlay, DialogTitle, DialogBody } from '@/Components/jolly-ui/dialog'
import { JollyDatePicker } from '@/Components/jolly-ui/date-picker'
import { CalendarDate } from '@internationalized/date'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditPosition = createCallable<Props, boolean>(
  ({ call, invoice, invoiceLine }) => {
    const { data, errors, updateAndValidate, submit, updateAndValidateWithoutEvent } =
      useForm<App.Data.InvoiceLineData>(
        'put',
        route('app.invoice.line-update', {
          invoice: invoice.id,
          invoiceLine: invoiceLine.id
        }),
        invoiceLine
      )

    const beginOn = data.service_period_begin
      ? parse(data.service_period_begin, 'dd.MM.yyyy', new Date())
      : undefined
    const endOn = data.service_period_end
      ? parse(data.service_period_end, 'dd.MM.yyyy', new Date())
      : undefined

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      try {
        await submit(event)
        call.end(true)
      } catch (error) {}
    }

    const handleClose = () => {
      call.end(false)
    }
    const [parsedDate, setParsedDate] = useState<CalendarDate | undefined>(() => {
      if (data.service_period_begin) {
        const issuedOn = parse(data.service_period_begin, 'dd.MM.yyyy', new Date())
        return new CalendarDate(issuedOn.getFullYear(), issuedOn.getMonth() + 1, issuedOn.getDate())
      }
      return undefined
    })

    useEffect(() => {
      if (data.service_period_begin) {
        const issuedOn = parse(data.service_period_begin, 'dd.MM.yyyy', new Date())
        setParsedDate(new CalendarDate(issuedOn.getFullYear(), issuedOn.getMonth() + 1, issuedOn.getDate()))
      } else {
        setParsedDate(undefined)
      }
    }, [data.service_period_begin])

    const handleIssuedOnChange = (date: CalendarDate | null) => {
      if (date) {
        const formattedDate = format(date.toDate('Europe/Berlin'), 'dd.MM.yyyy')
        updateAndValidateWithoutEvent('service_period_begin', formattedDate)
      } else {
        updateAndValidateWithoutEvent('service_period_begin', null)
      }
    }

    const handlePeriodChange = (range: { from: string; to: string }) => {
      updateAndValidateWithoutEvent('service_period_begin', range.from)
      updateAndValidateWithoutEvent('service_period_end', range.to)
    }

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

    return (
      <DialogOverlay isOpen={true} onOpenChange={() => call.end(false)}>
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


                      <FormDateRangePicker
                        label="Leistungszeitraum"
                        from={data.service_period_begin as unknown as string}
                        to={data.service_period_end as unknown as string}
                        onChange={range => handlePeriodChange(range)}
                      />
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
            <Button variant="outline" onClick={() => call.end(false)}>Abbrechen</Button>
            <Button form="invoiceLineForm" type="submit">
              Speichern
            </Button>
          </DialogFooter>

        </DialogContent>
      </DialogOverlay>
    )
  },
  300
)
