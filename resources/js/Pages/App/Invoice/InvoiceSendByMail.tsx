import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { Alert } from '@/Components/twc-ui/alert'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from './InvoiceDetailsLayout'

interface Props {
  invoice: App.Data.InvoiceData
  mail: App.Data.SendEmailData
}

export const InvoiceSendByMail: React.FC<Props> = ({ invoice, mail }) => {
  const { email_accounts } = usePage().props.auth
  const form = useForm<App.Data.SendEmailData>(
    'invoice-form',
    'post',
    route('app.invoice.store-send-by-mail', { invoice: invoice.id }),
    mail
  )

  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="flex-1">
        <FormCard
          className="mx-auto max-w-3xl"
          footer={
            <Button
              type="submit"
              form={form.id}
              variant="default"
              title="Rechnung per E-Mail versenden"
              isLoading={form.processing}
            />
          }
        >
          {invoice.sent_at && (
            <Alert variant="info">Die Rechnung wurde bereits am {invoice.sent_at} versendet.</Alert>
          )}

          <Form form={form}>
            <FormGrid>
              <div className="col-span-24">
                <FormSelect
                  label="Absender"
                  items={email_accounts}
                  itemName="email"
                  {...form.register('email_account_id')}
                />
              </div>
            </FormGrid>
            <FormGrid border>
              <div className="col-span-24">
                <FormTextField label="Empfänger" {...form.register('email')} />
              </div>
              <div className="col-span-24">
                <FormTextField label="Betreff" {...form.register('subject')} />
              </div>
              <div className="col-span-24">
                <FormTextArea label="Nachricht" {...form.register('body')} />
              </div>
            </FormGrid>
          </Form>
        </FormCard>
      </div>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceSendByMail
