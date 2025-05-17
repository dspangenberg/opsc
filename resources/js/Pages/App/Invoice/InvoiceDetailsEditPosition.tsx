import { createCallable } from 'react-call'
import type * as React from 'react'
import { Button, FormErrors, FormGroup, FormSelect, FormInput, FormTextarea, type Option } from '@dspangenberg/twcui'
import { ResponsiveDialog } from '@/Components/ResponsiveDialog'
import { Copy01Icon, Delete04Icon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import { useForm } from '@/Hooks/use-form'
import type { FormEvent } from 'react'
import { FormDateRangePicker } from '@/Components/FormDateRangePicker'
import { FormNumberInput } from '@/Components/FormNumberInput'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditPosition = createCallable<Props, boolean>(
  ({ call, invoice, invoiceLine }) => {

    const { data, errors, updateAndValidate, submit, updateAndValidateWithoutEvent } = useForm<App.Data.InvoiceLineData>(
      'put',
      route('app.invoice.line-update', {
        invoice: invoice.id,
        invoiceLine: invoiceLine.id
      }),
      invoiceLine
    )

    const taxOptions: Option[] = invoice.tax?.rates?.map(tax => ({
      value: tax.id as unknown as string,
      label: tax.name
    }))
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      try {
        await submit(event)
        call.end(true)
      } catch (error) {}
    }

    const handlePeriodChange = (range: { from: string; to: string }) => {
      updateAndValidateWithoutEvent('service_period_begin', range.from)
      updateAndValidateWithoutEvent('service_period_end', range.to)
    }

    const handleValueChange = (name: keyof App.Data.InvoiceLineData, value: string) => {
      updateAndValidateWithoutEvent(name, Number.parseInt(value))
    }

    const handleNumberInputChange = (name: string) => (value: number | undefined) => {
      updateAndValidateWithoutEvent(name, value)
    }

    return (
      <ResponsiveDialog
        isOpen={true}
        onClose={() => call.end(false)}
        description="Rechnungsposition bearbeiten"
        title="Rechnungsposition bearbeiten"
        width="4xl"
        dismissible={true}
        footer={
          <div className="flex items-start flex-1 justify-start">

            <div className="flex-1 space-x-2 justify-end items-center flex">
              <Button variant="outline" onClick={() => call.end(false)}>
                Abbrechen
              </Button>
              <Button form="invoiceLineForm" variant="default" type="submit">
                Position speichern
              </Button>
            </div>
          </div>
        }
      >
        <div className="px-2">
          <form onSubmit={handleSubmit} id="invoiceLineForm">
          <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-3">
                <FormNumberInput
                  name="quantity"
                  onValueChange={handleNumberInputChange('quantity')}
                  thousandSeparator={'.'}
                  allowedDecimalSeparators={[',']}
                  decimalSeparator=","
                  fixedDecimalScale={true}
                  value={data.quantity as number}
                  decimalScale={2}
                />
              </div>
              <div className="col-span-12">
                <FormTextarea
                  value={data.text}
                  rows={5}
                  onChange={updateAndValidate}
                  autoFocus
                  error={errors?.text || ''}
                  name="text"
                />
              </div>
              <div className="col-span-4">
                <FormNumberInput
                  name="price"
                  onValueChange={handleNumberInputChange('price')}
                  thousandSeparator={'.'}
                  allowedDecimalSeparators={[',']}
                  decimalSeparator=","
                  fixedDecimalScale={true}
                  value={data.price as number}
                  decimalScale={2}
                  suffix=" EUR"
                />
              </div>
              <div className="col-span-4">
                <FormNumberInput
                  name="amount"
                  onValueChange={handleNumberInputChange('amount')}
                  thousandSeparator={'.'}
                  allowedDecimalSeparators={[',']}
                  decimalSeparator=","
                  fixedDecimalScale={true}
                  value={data.amount as number}
                  decimalScale={2}
                  suffix=" EUR"
                />
              </div>
              <div className="col-span-12">
                <FormSelect
                  name="tax_rate_id"
                  label="Ust.-Satz"
                  onValueChange={value => handleValueChange('tax_rate_id', value)}
                  value={data.tax_rate_id as unknown as string}
                  error={errors?.tax_rate_id || ''}
                  options={taxOptions}
                />
              </div>
              <div className="col-span-12">
                <FormDateRangePicker
                  label="Leistungszeitraum"
                  from={data.service_period_begin as unknown as string}
                  to={data.service_period_end as unknown as string}
                  onChange={range => handlePeriodChange(range)}
                />
              </div>
              {invoiceLine.id}
            </FormGroup>
          </form>
        </div>
      </ResponsiveDialog>
    )
  },
  300
)
