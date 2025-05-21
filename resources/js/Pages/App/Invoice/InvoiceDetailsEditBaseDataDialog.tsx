import type * as React from 'react'
import { useState } from 'react'

import { FormErrors, FormGroup, Button } from '@dspangenberg/twcui'
import { router } from '@inertiajs/react'
import { Select } from '@/Components/twice-ui/select'
import { useForm, Form, } from "@/Components/twice-ui/form"
import { Combobox } from '@/Components/twice-ui/combobox'

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

  const { form, errors, data, updateAndValidateWithoutEvent } = useForm<App.Data.InvoiceData>(
    'basedata-form',
    'put',
    route('app.invoice.base-update', { invoice: invoice.id }),
    invoice
  );

  const handlePeriodChange = createDateRangeChangeHandler(
    updateAndValidateWithoutEvent,
    'service_period_begin',
    'service_period_end'
  )

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
                <Select<App.Data.InvoiceTypeData>
                  {...form.register("type_id")}
                  label="Rechnungsart"
                  items={invoice_types}
                  itemName="display_name"
                  itemValue="id"
                />
              </div>
              <div className="col-span-12">
                <Select<App.Data.TaxData>
                  {...form.register("tax_id")}
                  label="Umsatzsteuer"
                  items={taxes}
                />
              </div>
              <div className="col-span-24">
                <Combobox<App.Data.ProjectData>
                  label="Projekt"
                  {...form.register("project_id")}
                  isOptional
                  optionalValue='(kein Projekt zugeordnet)'
                  description='blbla'
                  items={projects}
                />
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
