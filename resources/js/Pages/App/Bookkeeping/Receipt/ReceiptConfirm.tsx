import { ArrowLeft01Icon, ArrowRight01Icon, Delete02Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useEffect } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Alert } from '@/Components/twc-ui/alert'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { PdfContainer } from '@/Components/twc-ui/pdf-container'
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
      _query: {
        confirm: 1,
        load_next: 1
      }
    },
    false
  )

  // TODO: Precognition-Validierung funktioniert nicht

  const form = useForm<App.Data.ReceiptData>('update-receipt', 'put', actionUrl, receipt)

  // Reset form data when receipt changes
  useEffect(() => {
    form.setData(receipt)
  }, [receipt.id, receipt.amount, receipt.contact_id, receipt.cost_center_id, receipt.reference])

  const checkForDuplicateReference = async (reference: string) => {
    if (!reference) return
    router.get(
      route('app.bookkeeping.receipts.check-reference', { reference: reference }),
      {},
      {
        preserveState: true,
        preserveScroll: true,
        only: []
      }
    )
  }

  const handleNextReceipt = () => {
    if (nextReceipt) {
      router.visit(nextReceipt, { preserveState: false })
    } else {
      router.visit(route('app.bookkeeping.receipts.index'))
    }
  }

  const handlePrevReceipt = () => {
    if (prevReceipt) {
      router.visit(prevReceipt, { preserveState: false })
    } else {
      router.visit(route('app.bookkeeping.receipts.index'))
    }
  }

  const handleContactChange = (contactId: string | number | null) => {
    if (contactId === null) return
    const numericId = typeof contactId === 'number' ? contactId : Number(contactId)
    const contact = contacts.find(contact => contact.id === numericId)
    form.updateAndValidateWithoutEvent('contact_id', numericId)

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
      router.delete(route('app.bookkeeping.receipts.destroy', { receipt: receipt.id }), {
        onSuccess: () => handleNextReceipt()
      })
    }
  }, [receipt.id])

  return (
    <PageContainer title="Beleg-Upload bestätigen" width="7xl" className="flex overflow-hidden">
      <PdfContainer file={route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })} />
      <FormCard
        footerClassName="justify-between px-4 py-1.5"
        footer={
          <>
            <div className="flex flex-1 justify-start gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={!prevReceipt}
                icon={ArrowLeft01Icon}
                onClick={handlePrevReceipt}
                tooltip="Vorheriger Beleg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextReceipt}
                disabled={!nextReceipt}
                icon={ArrowRight01Icon}
                tooltip="Nächster Beleg"
              />
              <Button
                variant="ghost-destructive"
                size="icon"
                icon={Delete02Icon}
                tooltip="Beleg löschen"
                onClick={handleDelete}
              />
            </div>
            <div className="flex-none">
              <Button
                variant="default"
                form={form.id}
                type="submit"
                isLoading={form.processing}
                title="Speichern"
              />
            </div>
          </>
        }
      >
        <Form form={form} className="flex-1">
          {receipt.duplicate_of && <Alert variant="info">Mögliches Duplikat.</Alert>}
          <FormGrid>
            <div className="col-span-8">
              <FormDatePicker label="Rechnungsdatum" {...form.register('issued_on')} autoFocus />
            </div>

            <div className="col-span-8">
              <FormNumberField
                label="Bruttobetrag"
                {...form.register('amount')}
                formatOptions={{
                  style: 'decimal',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }}
              />
            </div>

            <div className="col-span-8">
              <FormSelect<App.Data.CurrencyData>
                label="Währung"
                itemValue="code"
                itemName="code"
                items={currencies || []}
                {...form.register('org_currency')}
              />
            </div>

            <div className="col-span-24">
              <FormTextField
                label="Referenz"
                {...form.register('reference')}
                onBlur={() => checkForDuplicateReference(form.data.reference)}
              />
            </div>

            <div className="col-span-24">
              <FormComboBox<App.Data.ContactData>
                {...form.register('contact_id')}
                label="Kreditor"
                itemName="full_name"
                items={contacts}
                onChange={handleContactChange}
              />
            </div>
            <div className="col-span-24">
              <FormComboBox<App.Data.CostCenterData>
                {...form.register('cost_center_id')}
                label="Kostenstelle"
                items={cost_centers}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ReceiptConfirm
