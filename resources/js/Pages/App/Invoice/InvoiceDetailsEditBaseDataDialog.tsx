import type * as React from 'react'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { FormDateRangePicker } from '@/Components/FormDateRangePicker'

import { Button, FormErrors, FormGroup, FormSelect, type Option } from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import { router } from '@inertiajs/react'
import { ResponsiveDialog } from '@/Components/ResponsiveDialog'
import { JollyDatePicker } from '@/Components/jolly-ui/date-picker'
import { format, parse } from 'date-fns'
import {CalendarDate} from '@internationalized/date'
import { Input } from '@/Components/jolly-ui/textfield'


interface Props {
  invoice: App.Data.InvoiceData
  invoice_types: App.Data.InvoiceTypeData[]
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
}

export const InvoiceDetailsEditBaseDataDialog: React.FC<Props> = ({
  invoice,
  invoice_types,
  projects,
  taxes
}) => {
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.invoice.details', { invoice: invoice.id }))
  }
  const selectRef = useRef<HTMLButtonElement>(null)



  const invoiceTypeOptions: Option[] = invoice_types?.map(type => ({
    value: type.id as unknown as string,
    label: type.display_name
  }))

  const projectOptions: Option[] = projects?.map(project => ({
    value: project.id as unknown as string,
    label: project.name
  }))

  const taxOptions: Option[] = taxes?.map(tax => ({
    value: tax.id as unknown as string,
    label: tax.name
  }))

  console.log(taxes)

  projectOptions.unshift({ value: '0', label: 'ohne Projekt' })

  const { data, errors, updateAndValidate, submit, updateAndValidateWithoutEvent } =
    useForm<App.Data.InvoiceData>(
      'put',
      route('app.invoice.base-update', {
        invoice: invoice.id
      }),
      invoice
    )

  const [parsedDate, setParsedDate] = useState<CalendarDate | undefined>(() => {
    if (data.issued_on) {
      const issuedOn = parse(data.issued_on, 'dd.MM.yyyy', new Date())
      return new CalendarDate(issuedOn.getFullYear(), issuedOn.getMonth() + 1, issuedOn.getDate())
    }
    return undefined
  })

  useEffect(() => {
    if (data.issued_on) {
      const issuedOn = parse(data.issued_on, 'dd.MM.yyyy', new Date())
      setParsedDate(new CalendarDate(issuedOn.getFullYear(), issuedOn.getMonth() + 1, issuedOn.getDate()))
    } else {
      setParsedDate(undefined)
    }
  }, [data.issued_on])


  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  const handleValueChange = (name: keyof App.Data.InvoiceData, value: string) => {
    updateAndValidateWithoutEvent(name, Number.parseInt(value))
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

  const handleIssuedOnChange = (date: CalendarDate | null) => {
    if (date) {
      const formattedDate = format(date.toDate('Europe/Berlin'), 'dd.MM.yyyy')
      updateAndValidateWithoutEvent('issued_on', formattedDate)
    } else {
      updateAndValidateWithoutEvent('issued_on', null)
    }
  }

  return (
    <ResponsiveDialog
      title="Rechnungsstammdaten bearbeiten"
      isOpen={isOpen}
      onClose={handleClose}
      showDescription={false}
      className="max-w-xl"
      description="Rechnungsstammdaten bearbeiten"
      dismissible={true}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="clientForm" type="submit">
            Speichern
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} id="clientForm">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-8">
            <JollyDatePicker
              label="Rechnungsdatum"
              value={parsedDate}
              onChange={handleIssuedOnChange}
            />
          </div>
          <div className="col-span-16" />
          <div className="col-span-12">
            <Input value="sfdsdfdsfdfs"/>
            <FormSelect
              name="type_id"
              label="Rechnungsart"
              value={data.type_id as unknown as string}
              error={errors?.type_id || ''}
              onValueChange={value => handleValueChange('type_id', value)}
              options={invoiceTypeOptions}
            />
          </div>
          <div className="col-span-12">
            <FormSelect
              name="tax_id"
              label="Umsatzsteuer"
              value={data.tax_id as unknown as string}
              error={errors?.tax_id || ''}
              onValueChange={value => handleValueChange('tax_id', value)}
              options={taxOptions}
            />
          </div>
          <div className="col-span-24">
            <FormSelect
              name="project_id"
              label="Projekt"
              value={data.project_id as unknown as string}
              error={errors?.project_id || ''}
              onValueChange={value => handleValueChange('project_id', value)}
              options={projectOptions}
            />
          </div>
          <div className="col-span-12">
            <FormDateRangePicker
              label="Leistungszeitraum"
              from={invoice.service_period_begin as unknown as string}
              to={invoice.service_period_end as unknown as string}
              onChange={range => handlePeriodChange(range)}
            />
          </div>
        </FormGroup>
      </form>
    </ResponsiveDialog>
  )
}
