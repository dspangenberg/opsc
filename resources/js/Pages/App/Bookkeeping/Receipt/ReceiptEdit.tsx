import {
  Delete02Icon,
  EuroSendIcon,
  FileDownloadIcon,
  SquareLock02Icon,
  SquareUnlock01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Alert } from '@/Components/twc-ui/alert'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
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

type ReceiptForm = App.Data.ReceiptData & {
  is_reconversion: boolean
}

const ReceiptEdit: React.FC<Props> = ({ receipt, contacts, nextReceipt, cost_centers }) => {
  const { handleDownload } = useFileDownload({
    route: route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })
  })

  const handleNextReceipt = () => {
    if (nextReceipt) {
      router.visit(nextReceipt)
    } else {
      router.visit(route('app.bookkeeping.receipts.index'))
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

  const breadcrumbs = useMemo(
    () => [
      { title: 'Buchhaltung' },
      { title: 'Belege', url: route('app.bookkeeping.receipts.index') },
      {
        title: String(receipt.document_number || receipt.id)
      }
    ],
    [receipt.id, receipt.document_number]
  )

  const form = useForm<ReceiptForm>(
    'update-receipt',
    'put',
    route(
      'app.bookkeeping.receipts.update',
      {
        receipt: receipt.id,
        _query: { confirm: 1, load_next: 1 }
      },
      false
    ),
    {
      ...receipt,
      is_reconversion: false
    }
  )

  // Form-Daten aktualisieren wenn sich receipt Props ändern
  useEffect(() => {
    form.setData({
      ...receipt,
      is_reconversion: false
    })
  }, [receipt.id, receipt.amount, receipt.org_amount, receipt.exchange_rate])

  if (!receipt) {
    return null
  }

  const handleLinkPayments = () => {
    router.visit(route('app.bookkeeping.receipts.payments', { id: receipt.id }))
  }

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  })

  const handleContactChange = (contactId: string | number | null) => {
    if (contactId === null) return
    const numericId = typeof contactId === 'number' ? contactId : Number(contactId)
    const contact = contacts.find(contact => contact.id === numericId)
    form.updateAndValidateWithoutEvent('contact_id', numericId)

    if (contact?.cost_center_id) {
      form.updateAndValidateWithoutEvent('cost_center_id', contact.cost_center_id)
    }
  }

  const handleUnlock = (isLocked: boolean) => {
    if (isLocked) {
      router.put(
        route('app.bookkeeping.receipts.unlock', { receipt: receipt.id }),
        {},
        { preserveState: false }
      )
    } else {
      router.put(route('app.bookkeeping.receipts.lock', { receipt: receipt.id }))
    }
  }

  const hasLockedBookings = receipt.bookings?.some(booking => booking.is_locked)
  const isDeleteDisabled = !!(receipt.is_locked || hasLockedBookings)

  return (
    <PageContainer
      title="Beleg bearbeiten"
      width="7xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <PdfContainer
        file={route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })}
        filename={receipt.org_filename}
      />
      <FormCard
        footerClassName="justify-between py-1.5"
        footer={
          <>
            <div className="flex flex-1 justify-start gap-1">
              <Button
                variant="ghost"
                size="icon"
                icon={receipt.is_locked ? SquareLock02Icon : SquareUnlock01Icon}
                isDisabled={hasLockedBookings}
                tooltip="Beleg entsperren"
                onClick={() => handleUnlock(receipt.is_locked)}
              />
              <Button
                variant="ghost-destructive"
                size="icon"
                icon={Delete02Icon}
                tooltip="Beleg löschen"
                isDisabled={isDeleteDisabled}
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
            <div className="flex flex-1 justify-end gap-2">
              {receipt.is_confirmed && <Button variant="outline" title="Zurück" />}
              <Button
                variant="default"
                form={form.id}
                type="submit"
                isLoading={form.processing}
                isDisabled={receipt.is_locked as boolean}
                title="Speichern"
              />
            </div>
          </>
        }
      >
        <Form form={form} preserveState={false} className="flex-1">
          {receipt.duplicate_of && <Alert variant="info">Mögliches Duplikat.</Alert>}
          <FormGrid>
            <div className="col-span-8">
              <FormDatePicker
                label="Rechnungsdatum"
                {...form.register('issued_on')}
                autoFocus
                isDisabled={receipt.is_locked as boolean}
              />
            </div>

            <div className="col-span-8">
              <FormNumberField
                label="Bruttobetrag"
                {...form.register('amount')}
                isDisabled={receipt.is_locked as boolean}
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
              {form.data.org_currency && form.data.org_currency !== 'EUR' && (
                <FormNumberField
                  label="Ursprungsbetrag"
                  isDisabled={!form.data.is_reconversion}
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
            {form.data.is_foreign_currency && (
              <div className="col-span-24 -mt-3">
                <FormCheckbox
                  isDisabled={form.data.is_locked}
                  label="Ursprungsbetrag korrigieren + neu umrechnen"
                  {...form.registerCheckbox('is_reconversion')}
                />
              </div>
            )}
            <div className="col-span-24">
              <FormTextField
                label="Referenz"
                {...form.register('reference')}
                isDisabled={receipt.is_locked as boolean}
              />
            </div>

            <div className="col-span-24">
              <FormComboBox<App.Data.ContactData>
                {...form.register('contact_id')}
                isDisabled={receipt.is_locked as boolean}
                label="Kreditor"
                itemName="full_name"
                items={contacts}
                onChange={handleContactChange}
              />
            </div>
            <div className="col-span-24">
              <FormComboBox<App.Data.CostCenterData>
                {...form.register('cost_center_id')}
                isDisabled={receipt.is_locked as boolean}
                label="Kostenstelle"
                items={cost_centers}
              />
            </div>
          </FormGrid>
          <FormGrid border>
            <div className="col-span-24">
              <Table className="w-full border-0">
                <TableBody className="[&_tr:last-child]:border-b-0">
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
                      <TableRow key={payable.id} className="border-b-0!">
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
          </FormGrid>
          <FormGrid border>
            <div className="col-span-24">
              <Table className="w-full border-0">
                <TableBody className="[&_tr:last-child]:border-b-0">
                  {receipt.bookings?.map(booking =>

                      <TableRow key={booking.id} className="border-b-0!">
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>{booking.booking_text}</TableCell>
                        <TableCell className="text-right">
                          {currencyFormatter.format(booking.amount || 0)}
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </FormGrid>
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default ReceiptEdit
