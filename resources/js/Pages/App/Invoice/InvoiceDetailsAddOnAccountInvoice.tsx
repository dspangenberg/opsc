import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { Button } from '@/Components/ui/twc-ui/button'
import { DateRangePicker } from '@/Components/ui/twc-ui/date-picker'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { NumberField } from '@/Components/ui/twc-ui/number-field'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { columns } from '@/Pages/App/Invoice/InvoiceIndexColumns'

interface Props {
  invoice: App.Data.InvoiceData
  invoices: App.Data.InvoiceData[]
}

export const InvoiceDetailsAddOnAccountInvoice: React.FC<Props> = ({ invoice, invoices }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedRows, setSelectedRows] = useState<App.Data.InvoiceData[]>([])
  console.log(invoices)

  const handleOnClosed = () => {
    setIsOpen(false)
    router.get(route('app.invoice.details', { invoice: invoice.id }))
  }

  const handleSave = () => {
    setIsOpen(false)
    router.post(
      route('app.invoice.link-on-account-store', {
        invoice: invoice.id,
        _query: {
          ids: selectedRows.map(row => row.id).join(',')
        }
      })
    )
  }

  return (
    <Dialog
      isOpen={isOpen}
      title="Akontorechnungen anrechnen"
      confirmationVariant="destructive"
      onClosed={handleOnClosed}
      width="5xl"
      bodyPadding
      description="Rechnungstammdaten wie Rechnungsnummer, Rechnungsdatum, Leistungsdatum, Rechnungsart, Projekt, Umsatzsteuer, etc. bearbeiten"
      footer={renderProps => (
        <>
          <Button id="dialog-cancel-button" variant="outline" onClick={() => renderProps.close()}>
            Abbrechen
          </Button>
          <Button onClick={handleSave}>Speichern</Button>
        </>
      )}
    >
      <DataTable
        columns={columns}
        data={invoices}
        onSelectedRowsChange={setSelectedRows}
        itemName="Rechnungen mit den Suchkriterien"
      />
    </Dialog>
  )
}

export default InvoiceDetailsAddOnAccountInvoice
