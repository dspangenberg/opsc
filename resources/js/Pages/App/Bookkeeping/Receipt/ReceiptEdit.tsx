import { ArrowLeft01Icon, ArrowRight01Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { PdfViewerContainer } from '@/Components/PdfViewerContainer'
import { Alert } from '@/Components/ui/twc-ui/alert'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { ComboBox } from '@/Components/ui/twc-ui/combo-box'
import { DatePicker } from '@/Components/ui/twc-ui/date-picker'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { NumberField } from '@/Components/ui/twc-ui/number-field'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  receipt: App.Data.ReceiptData
  nextReceipt: string
  prevReceipt: string
  contacts: App.Data.ContactData[]
  cost_centers: App.Data.CostCenterData[]
  currencies: App.Data.CurrencyData[]
  file: string
}

const ReceiptConfirm: React.FC<Props> = ({
  receipt,
  contacts,
  nextReceipt,
  prevReceipt,
  cost_centers,
  currencies
}) => {
  const actionUrl = route(
    'app.bookkeeping.receipts.update',
    {
      receipt: receipt.id,
      _query: { confirm: 1, load_next: 1 }
    },
    false
  )

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  })
  const form = useForm<App.Data.ReceiptData>('update-receipt', 'put', actionUrl, receipt, {})

  const handleNextReceipt = () => {
    if (nextReceipt) {
      router.visit(nextReceipt)
    } else {
      router.visit(route('app.bookkeeping.receipts.index'))
    }
  }

  const handlePrevReceipt = () => {
    if (prevReceipt) {
      router.visit(prevReceipt)
    } else {
      router.visit(route('app.bookkeeping.receipts.index'))
    }
  }

  const handleContactChange = (contactId: number) => {
    const contact = contacts.find(contact => contact.id === contactId)
    form.updateAndValidateWithoutEvent('contact_id', contactId)

    if (contact?.cost_center_id) {
      form.updateAndValidateWithoutEvent('cost_center_id', contact.cost_center_id)
    }
  }

  const handleDelete = useCallback(async () => {
    const promise = await AlertDialog.call({
      title: 'Beleg löschen',
      message: 'Möchtest Du den Beleg wirklich löschen?',
      buttonTitle: 'Beleg löschen',
      variant: 'destructive'
    })

    if (promise) {
      router.delete(route('app.bookkeeping.receipts.destroy', { receipt: receipt.id }))
      handleNextReceipt()
    }
  }, [receipt.id])

  return (
    <PageContainer title="Beleg bestätigen" width="7xl" className="flex overflow-hidden">
      <PdfViewerContainer
        document={route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })}
        filename={receipt.org_filename}
        showFileName
      />
      <Form form={form} className="flex-1">
        {receipt.duplicate_of && <Alert variant="info">Mögliches Duplikat.</Alert>}
        <FormGroup>
          <div className="col-span-8">
            <DatePicker label="Rechnungsdatum" {...form.register('issued_on')} autoFocus />
          </div>

          <div className="col-span-8">
            <NumberField
              label="Bruttobetrag"
              {...form.register('amount')}
              formatOptions={{
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'code',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }}
            />
          </div>
          <div className="col-span-8">
            {form.data.org_currency !== 'EUR' && (
              <NumberField
                label="Ursprungsbetrag"
                isDisabled
                {...form.register('org_amount')}
                formatOptions={{
                  style: 'currency',
                  currency: form.data.org_currency as string,
                  currencyDisplay: 'code',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }}
              />
            )}
          </div>
          <div className="col-span-24">
            <TextField label="Referenz" {...form.register('reference')} />
          </div>

          <div className="col-span-24">
            <ComboBox<App.Data.ContactData>
              {...form.register('contact_id')}
              label="Kreditor"
              itemName="full_name"
              items={contacts}
              onChange={handleContactChange}
            />
          </div>
          <div className="col-span-24">
            <ComboBox<App.Data.CostCenterData>
              {...form.register('cost_center_id')}
              label="Kostenstelle"
              items={cost_centers}
            />
            <Checkbox {...form.registerCheckbox('is_confirmed')} className="pt-1.5">
              Beleg bestätigen und buchen
            </Checkbox>
          </div>
          <div className="col-span-24 flex justify-between gap-2">
            <div className="flex flex-1 justify-start gap-1">
              <Button
                variant="ghost-destructive"
                size="icon"
                icon={Delete02Icon}
                tooltip="Beleg löschen"
                onClick={handleDelete}
              />
            </div>
            <Button
              variant="default"
              form={form.id}
              type="submit"
              isLoading={form.processing}
              title="Speichern"
            />
          </div>
        </FormGroup>
      </Form>
    </PageContainer>
  )
}

export default ReceiptConfirm
