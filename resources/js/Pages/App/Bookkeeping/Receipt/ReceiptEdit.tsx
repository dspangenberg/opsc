import { Delete02Icon, EuroSendIcon, FileDownloadIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Alert } from '@/Components/twc-ui/alert'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormNumberField } from '@/Components/twc-ui/form-number-field'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import { PdfContainer } from '@/Components/twc-ui/pdf-container'
import { Table, TableBody, TableCell, TableRow } from '@/Components/ui/table'
import { useFileDownload } from '@/Hooks/use-file-download'
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
const ReceiptConfirm: React.FC<Props> = ({ receipt, contacts, nextReceipt, cost_centers }) => {
  const actionUrl = route(
    'app.bookkeeping.receipts.update',
    {
      receipt: receipt.id,
      _query: { confirm: 1, load_next: 1 }
    },
    false
  )

  const handleLinkPayments = () => {
    router.visit(route('app.bookkeeping.receipts.payments', { id: receipt.id }))
  }

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
      router.delete(route('app.bookkeeping.receipts.destroy', { receipt: receipt.id }))
      handleNextReceipt()
    }
  }, [receipt.id])

  const { handleDownload } = useFileDownload({
    route: route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })
  })

  return (
    <PageContainer title="Beleg bearbeiten" width="7xl" className="flex overflow-hidden">
      <PdfContainer
        file={route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })}
        filename={receipt.org_filename}
      />
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
              <FormNumberField
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
            <FormTextField label="Referenz" {...form.register('reference')} />
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
          <div className="col-span-24">
            <Table className="w-full">
              <TableBody>
                {receipt.payable?.map(payable =>
                  payable.is_currency_difference ? (
                    <TableRow key={payable.id}>
                      <TableCell>{payable.issued_on}</TableCell>
                      <TableCell>Währungsdifferenz</TableCell>
                      <TableCell className="text-right">
                        {currencyFormatter.format(payable.amount || 0)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={payable.id}>
                      <TableCell>{payable.transaction.booked_on}</TableCell>
                      <TableCell>{payable.transaction.purpose}</TableCell>
                      <TableCell className="text-right">
                        {currencyFormatter.format(payable.amount || 0)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
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
              <Button
                icon={EuroSendIcon}
                tooltip="Mit Transaktionen verknüpfen"
                size="icon"
                variant="ghost"
                onClick={handleLinkPayments}
              />
              <Button
                icon={FileDownloadIcon}
                tooltip="Download"
                size="icon"
                variant="ghost"
                onClick={handleDownload}
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
        </FormGrid>
      </Form>
    </PageContainer>
  )
}

export default ReceiptConfirm
