import type * as React from 'react'
import { type FormEvent, useState } from 'react'

import { FormErrors, FormGroup } from '@dspangenberg/twcui'
import { useForm } from '@/Hooks/use-form'
import { router } from '@inertiajs/react'
import { DatePicker } from '@/Components/twice-ui/date-picker'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'
import { ComboboxItem, JollyComboBox } from '@/Components/jolly-ui/combobox'

import { Button } from '@/Components/jolly-ui/button'
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/Components/jolly-ui/dialog'
import { createDateRangeChangeHandler, DateRangePicker } from '@/Components/twice-ui/date-range-picker'

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

  const {
    data,
    errors,
    updateAndValidate,
    submit,
    updateAndValidateWithoutEvent
  } =
    useForm<App.Data.InvoiceData>(
      'put',
      route('app.invoice.base-update', {
        invoice: invoice.id
      }),
      invoice
    )

  const handlePeriodChange = createDateRangeChangeHandler(
    updateAndValidateWithoutEvent,
    'service_period_begin',
    'service_period_end'
  )

  const handleValueChange = (name: keyof App.Data.InvoiceData, value: unknown) => {
    updateAndValidateWithoutEvent(name, Number(value))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
      handleClose()
    } catch (error) {
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
          <form onSubmit={handleSubmit} id="baseDataForm" className="w-full">
            <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-9">
                <DatePicker
                  autoFocus
                  label="Rechnungsdatum"
                  name="issued_on"
                  value={data.issued_on}
                  hasError={!!errors.issued_on || false}
                  onChange={updateAndValidate}
                />
              </div>
              <div className="col-span-14" />
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
                      {item.name}
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
              <div className="col-span-14">
                <DateRangePicker
                  label="Leistungsdatum"
                  value={{
                    start: data.service_period_begin,
                    end: data.service_period_end
                  }}
                  name="service_period"
                  onChange={handlePeriodChange}
                  hasError={!!errors.service_period_begin || !!errors.service_period_end}
                />
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
