import type * as React from 'react'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import { FormErrors, FormGroup } from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import { router } from '@inertiajs/react'
import { JollyDatePicker } from '@/Components/jolly-ui/date-picker'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'
import { ComboboxItem, JollyComboBox } from "@/Components/jolly-ui/combobox"

import { format, parse } from 'date-fns'
import {CalendarDate} from '@internationalized/date'
import { Button } from '@/Components/jolly-ui/button'
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/Components/jolly-ui/dialog'

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

  const { data, errors, updateAndValidate, submit, updateAndValidateWithoutEvent } =
    useForm<App.Data.InvoiceData>(
      'put',
      route('app.invoice.base-update', {
        invoice: invoice.id
      }),
      invoice
    )

  const [parsedDate, setParsedDate] = useState<CalendarDate | null>(() => {

    if (data.issued_on) {
      const issuedOn = data.issued_on ? parse(data.issued_on, 'dd.MM.yyyy', new Date()) : null
      return issuedOn ? new CalendarDate(issuedOn.getFullYear(), issuedOn.getMonth() + 1, issuedOn.getDate()) : null
    }

   return null
  })

  useEffect(() => {
    if (data.issued_on) {
      const issuedOn = parse(data.issued_on, 'dd.MM.yyyy', new Date())
      setParsedDate(new CalendarDate(issuedOn.getFullYear(), issuedOn.getMonth() + 1, issuedOn.getDate()))
    } else {
      setParsedDate(null)
    }
  }, [data.issued_on])


  useEffect(() => {
    selectRef.current?.focus()
  }, [])

  const handleValueChange = (name: keyof App.Data.InvoiceData, value: unknown) => {
    updateAndValidateWithoutEvent(name, Number(value))
  }


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
      handleClose()
    } catch (error) {}
  }


  const handleIssuedOnChange = (date: CalendarDate | null) => {
    if (date) {
      const formattedDate = format(date.toDate('Europe/Berlin'), 'dd.MM.yyyy')
      updateAndValidateWithoutEvent('issued_on', formattedDate)
    } else {
      updateAndValidateWithoutEvent('issued_on', null)
    }
  }

  // @ts-ignore
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle>Rechnungsstammdaten bearbeiten</DialogTitle>
        </DialogHeader>

        <DialogBody>
      <form onSubmit={handleSubmit} id="baseDataForm">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-8">
            <JollyDatePicker
              autoFocus
              label="Rechnungsdatum"
              value={parsedDate}
              onChange={handleIssuedOnChange}
            />
          </div>
          <div className="col-span-16" />
          <div className="col-span-12">
            <JollySelect<App.Data.InvoiceTypeData>
              onSelectionChange={selected =>
                handleValueChange('type_id', selected)
              }
              selectedKey={data.type_id}
              label="Rechnungsart"
              items={invoice_types || []}
            >
              {item => (
                <SelectItem id={Number(item.id)}>
                  {item.display_name}
                </SelectItem>
              )}
            </JollySelect>
          </div>
          <div className="col-span-12">
            <JollySelect<App.Data.TaxData>
              onSelectionChange={selected =>
                handleValueChange('tax_id', selected)
              }
              selectedKey={data.tax_id}
              label="Umsatzsteuer"
              items={taxes || []}
            >
              {item => (
                <SelectItem>
                  { item.name}
                </SelectItem>
              )}
            </JollySelect>
          </div>
          <div className="col-span-24">
            <JollyComboBox
              label="Projekt"
              selectedKey={data.project_id}
              onSelectionChange={selected =>
                handleValueChange('project_id', selected)
              }
            >
              {projects.map(project => (
                <ComboboxItem key={project.id} id={project.id as number}>
                  {project.name}
                </ComboboxItem>
              ))}
            </JollyComboBox>
          </div>
          <div className="col-span-12">
            Leistungszeitraum
          </div>
        </FormGroup>
      </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="baseDataForm" type="submit">
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  )
}
