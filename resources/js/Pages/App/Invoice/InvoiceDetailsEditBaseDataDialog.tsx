import type * as React from 'react'
import { useState } from 'react'

import { FormErrors, FormGroup, Button } from '@dspangenberg/twcui'
import { router } from '@inertiajs/react'
import { JollySelect, SelectItem } from '@/Components/jolly-ui/select'
import { ComboboxItem, JollyComboBox } from '@/Components/jolly-ui/combobox'
import { useForm, Form, } from "@/Components/twice-ui/form"

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from '@/Components/jolly-ui/dialog'
import { createDateRangeChangeHandler, DateRangePicker, DatePicker } from '@/Components/twice-ui/date-picker'

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

  const { form, errors, data, updateAndValidateWithoutEvent, updateAndValidate } = useForm<App.Data.InvoiceData>(
    'basedata-form',
    'put',
    route('app.invoice.base-update', { invoice: invoice.id }),
    invoice
  );

  console.log(form)

  const handlePeriodChange = createDateRangeChangeHandler(
    updateAndValidateWithoutEvent,
    'service_period_begin',
    'service_period_end'
  )

  const handleValueChange = (name: keyof App.Data.InvoiceData, value: unknown) => {
    updateAndValidateWithoutEvent(name, Number(value))
  }

    // @ts-ignore
  return (
    <DialogOverlay isOpen={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle>Rechnungsstammdaten bearbeiten</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Form
            form={form}
          >
            <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-9">
                <DatePicker
                  autoFocus
                  label="Rechnungsdatum"
                  {...form.register("issued_on")}
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
              <div className="col-span-16">
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
          </Form>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form={form.id} type="submit">Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  )
}
