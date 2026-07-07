import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { Radio, RadioGroup } from '@/Components/twc-ui/radio-group'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'

interface OfferCreateInvoiceProps extends PageProps {
  offer: App.Data.OfferData
  statuses: LaravelOptions[]
  invoices_count: number
}

interface Invoice {
  invoice_type_id: string
  should_summarize: boolean
  deposit: number
}

type OfferInvoiceForm = Partial<Invoice>

const OfferCreateInvoice: React.FC<OfferCreateInvoiceProps> = ({
  offer,
  statuses,
  invoices_count
}) => {
  const [type, setType] = useState('deposit')
  const form = useForm<OfferInvoiceForm>(
    'create-invoice-form',
    'post',
    route('app.offer.store-invoice', { offer: offer.id }),
    {
      invoice_type_id: 'deposit',
      should_summarize: true,
      deposit: 0
    }
  )

  const handleTypeChange = (value: string) => {
    if (value === 'deposit') {
      form.setData('should_summarize', true)
    }
    setType(value)
    form.setData('invoice_type_id', value)
  }

  return (
    <OfferDetailsLayout offer={offer} statuses={statuses}>
      <div className="mr-8 flex-1">
        <FormCard
          className="mx-auto max-w-2xl"
          title="Rechnung aus Angebot erstellen"
          footer={
            <Button form={form.id} variant="default" type="submit" title="Rechnung erstellen" />
          }
        >
          <Form form={form}>
            <FormGrid>
              <div className="col-span-24">
                <RadioGroup
                  isRequired
                  name="invoice_type_id"
                  label="Rechnungsart"
                  value={type}
                  onChange={value => handleTypeChange(value as string)}
                >
                  <Radio value="deposit">Akontorechnung</Radio>
                  <Radio isDisabled={!invoices_count} value="final">
                    Schlussrechnung
                  </Radio>
                  <Radio value="default">Standardrechnung</Radio>
                </RadioGroup>
              </div>
            </FormGrid>
            <FormGrid>
              <div className="col-span-12">
                <FormNumberField
                  label="Höhe der Anzahlung"
                  isDisabled={form.data.invoice_type_id !== 'deposit'}
                  {...form.register('deposit')}
                />
                <div className="pt-1">
                  <FormCheckbox
                    isDisabled={form.data.invoice_type_id === 'deposit'}
                    label="Positionen zusammenfassen"
                    {...form.registerCheckbox('should_summarize')}
                  />
                </div>
              </div>
            </FormGrid>
          </Form>
        </FormCard>
      </div>
      <div className="h-fit w-full max-w-sm flex-none border-l! border-stone-200 px-1">
        <div className="fixed w-full max-w-sm space-y-6">
          <OfferDetailsSide offer={offer} statuses={statuses} />
        </div>
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferCreateInvoice
