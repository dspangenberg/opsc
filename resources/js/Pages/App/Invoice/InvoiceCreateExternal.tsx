import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormDateRangePicker } from '@/Components/twc-ui/form-date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { PdfContainer } from '@/Components/twc-ui/pdf-container'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  document: App.Data.DocumentData
  invoice: App.Data.InvoiceData
  payment_deadlines: App.Data.PaymentDeadlineData[]
  taxes: App.Data.TaxData[]
}

type FormData = App.Data.InvoiceData & {
  amount: number
}

const InvoiceCreateExternal: React.FC<Props> = ({
  document,
  invoice,
  payment_deadlines,
  taxes
}) => {
  const form = useForm<FormData>(
    'create-external-invoice-form',
    'post',
    route('app.invoice.store-external'),
    {
      amount: 0,
      ...invoice
    }
  )

  const breadcrumbs = useMemo(
    () => [
      { title: 'Rechnungen', url: route('app.invoice.index') },
      { title: `${document.filename} als externe Rechnung hinzufügen` }
    ],
    [document.filename]
  )

  return (
    <PageContainer
      title={`${document.filename} als externe Rechnung hinzufügen`}
      width="8xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <PdfContainer
        file={route('app.document.pdf', { document: document.id })}
        filename={document.filename}
      />
      <FormCard
        footer={
          <Button
            form={form.id}
            variant="default"
            type="submit"
            title="Speichern"
            isLoading={form.processing}
          />
        }
      >
        <Form form={form} className="flex-1">
          <FormGrid>
            <div className="col-span-6">
              <FormDatePicker label="Datum" {...form.register('issued_on')} autoFocus />
            </div>
            <div className="col-span-7">
              <FormNumberField
                formatOptions={{
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }}
                label="Rechnungsnummer"
                {...form.register('invoice_number')}
              />
            </div>
            <div className="col-span-6">
              <FormNumberField label="Nettobetrag" {...form.register('amount')} />
            </div>
            <div className="col-span-5">
              <FormSelect {...form.register('tax_id')} label="Umsatzsteuer" items={taxes} />
            </div>
            <div className="col-span-13">
              <FormDateRangePicker
                label="Leistungsdatum"
                {...form.registerDateRange('service_period_begin', 'service_period_end')}
              />
            </div>
            <div className="col-span-11">
              <FormSelect
                {...form.register('payment_deadline_id')}
                label="Zahlungsziel"
                items={payment_deadlines}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default InvoiceCreateExternal
