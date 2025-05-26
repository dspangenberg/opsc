import * as React from 'react'

import { Button, FormErrors } from '@dspangenberg/twcui'
import { router } from '@inertiajs/react'
import { Select } from '@/Components/twcui/select'
import { Form, useForm } from '@/Components/twcui/form'
import { Combobox } from '@/Components/twcui/combobox'
import {
 Dialog
} from '@/Components/twcui/dialog'
import { createDateRangeChangeHandler, DatePicker, DateRangePicker } from '@/Components/twcui/date-picker'
import { Checkbox } from '@/Components/jolly-ui/checkbox'
import { FormGroup } from '@/Components/twcui/form-group'
import { AlertDialog } from '@/Components/twcui/alert-dialog'
import { useRef } from 'react'

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

  const {
    form,
    errors,
    data,
    updateAndValidateWithoutEvent
  } = useForm<App.Data.InvoiceData>(
    'basedata-form',
    'put',
    route('app.invoice.base-update', { invoice: invoice.id }),
    invoice
  )

  const handlePeriodChange = createDateRangeChangeHandler(
    updateAndValidateWithoutEvent,
    'service_period_begin',
    'service_period_end'
  )
  const dialogCloseRef = useRef<{
    (): Promise<boolean>;
    showConfirmation?: () => Promise<boolean>;
  } | null>(null);

  // This function is called when the user clicks the Cancel/Close button in the footer
  const handleClose = async () => {
    if (dialogCloseRef.current) {
      try {
        if (form.isDirty) {
          // If the form is dirty, show the confirmation dialog directly
          const confirmed = await AlertDialog.call({
            title: 'Änderungen verwerfen',
            message: 'Möchtest Du die Änderungen verwerfen?',
            buttonTitle: 'Verwerfen',
            variant: "default"
          });

          if (confirmed) {
            // If the user confirmed, close the dialog
            await dialogCloseRef.current();
          }
          // If the user cancelled, do nothing (dialog stays open)
        } else {
          // If the form is not dirty, close the dialog without confirmation
          await dialogCloseRef.current();
        }
      } catch (error) {
        console.error("Error in handleClose:", error);
      }
    }
  };

  return (
    <Dialog
      isOpen={true}
      confirmClose={form.isDirty}
      title="Rechnungsstammdaten bearbeiten"
      closeRef={dialogCloseRef}
      description="Rechnungstammdaten wie Rechnungsnummer, Rechnungsdatum, Leistungsdatum, Rechnungsart, Projekt, Umsatzsteuer, etc. bearbeiten"
      footer={
      <>
        <Button variant="outline" onClick={handleClose}>
          {form.isDirty? 'Abbrechen' : 'Schließen'}
        </Button>
        <Button form={form.id} type="submit">Speichern</Button>
      </>
      }
    >



          <Form
            form={form}
          >
            <FormErrors errors={errors} />
            <FormGroup>
              <div className="col-span-8">
                <DatePicker
                  autoFocus
                  label="Rechnungsdatum"
                  {...form.register('issued_on')}
                />
              </div>
              <div className="col-span-4" />
              <div className="col-span-12">
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

              <div className="col-span-12">
                <Select<App.Data.InvoiceTypeData>
                  {...form.register('type_id')}
                  label="Rechnungsart"
                  items={invoice_types}
                  itemName="display_name"
                  itemValue="id"
                />
              </div>
              <div className="col-span-12">
                <Select<App.Data.TaxData>
                  {...form.register('tax_id')}
                  label="Umsatzsteuer"
                  items={taxes}
                />
              </div>
              <div className="col-span-24">
                <Combobox<App.Data.ProjectData>
                  label="Projekt"
                  {...form.register('project_id')}
                  isOptional
                  optionalValue="(kein Projekt)"
                  items={projects}
                />
                <Checkbox
                  {...form.registerCheckbox('is_recurring')}
                  className="pt-1.5"
                >
                  Wiederkehrende Rechnung
                </Checkbox>
              </div>
            </FormGroup>
          </Form>
        </Dialog>
  )
}
