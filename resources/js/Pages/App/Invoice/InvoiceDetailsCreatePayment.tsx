import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { DataTable } from '@/Components/DataTable'

import { Button } from '@/Components/twc-ui/button'
import { Dialog } from '@/Components/twc-ui/dialog'
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
    setIsOpen(false)
    router.get(
      route('app.invoice.store.payment', {
        invoice: invoice.id,
        _query: {
          ids,
          remaining_amount_is_currency_difference: false
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
          {selectedRows.length === 1 && (
            <Button type="button" variant="outline">
              Teilbetrag
            </Button>
          )}
          <Button type="button" onClick={handleSaveClicked}>
            Speichern
          </Button>
        </>
      )}
    >
      <div className="overflow-hidden">
        <DataTable<App.Data.TransactionData, unknown>
          columns={columns}
          onSelectedRowsChange={setSelectedRows}
          data={transactions}
          itemName="Transaktionen"
        />
      </div>
    </Dialog>
  )
}

export default InvoiceDetailsCreatePayment
