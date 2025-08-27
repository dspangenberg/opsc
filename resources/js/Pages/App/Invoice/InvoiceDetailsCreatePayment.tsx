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
import { columns } from './InvoiceDetailsTransactionColumns'

interface Props {
  invoice: App.Data.InvoiceData
  transactions: App.Data.TransactionData[]
}

export const InvoiceDetailsCreatePayment: React.FC<Props> = ({ invoice, transactions }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedRows, setSelectedRows] = useState<App.Data.TransactionData[]>([])

  const handleOnClosed = () => {
    setIsOpen(false)
    router.get(route('app.invoice.details', { invoice: invoice.id }))
  }

  const handleSaveClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    console.log(ids)
    router.get(
      route('app.invoice.store.payment', {
        invoice: invoice.id,
        _query: {
          ids
        }
      })
    )
  }

  return (
    <Dialog
      isOpen={isOpen}
      title="Zahlungen zuordnen"
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
          <Button type="button" onClick={handleSaveClicked}>
            Speichern
          </Button>
        </>
      )}
    >
      <DataTable<App.Data.TransactionData, unknown>
        columns={columns}
        onSelectedRowsChange={setSelectedRows}
        data={transactions}
        itemName="Transaktionen"
      />
    </Dialog>
  )
}

export default InvoiceDetailsCreatePayment
