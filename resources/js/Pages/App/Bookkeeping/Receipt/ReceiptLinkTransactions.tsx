import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { DataTable } from '@/Components/DataTable'

import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { columns } from './ReceiptTransactionColumns'

interface Props {
  receipt: App.Data.ReceiptData
  transactions: App.Data.TransactionData[]
}

export const ReceiptLinkTransactions: React.FC<Props> = ({ receipt, transactions }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedRows, setSelectedRows] = useState<App.Data.TransactionData[]>([])

  const [remainingAmountIsCurrencyDifference, setRemainingAmountIsCurrencyDifference] =
    useState<boolean>(false)
  const handleOnClosed = () => {
    setIsOpen(false)
    router.get(route('app.bookkeeping.receipts.confirm', { receipt: receipt.id }))
  }

  const handleSaveClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
    setIsOpen(false)
    router.get(
      route('app.bookkeeping.receipts.payments-store', {
        receipt: receipt.id,
        _query: {
          ids,
          remaining_amount_is_currency_difference: remainingAmountIsCurrencyDifference
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
        <div className="flex items-center justify-around gap-2">
          <div className="flex-none">
            <Checkbox
              name="remainingAmountIsCurrencyDifference"
              checked={remainingAmountIsCurrencyDifference}
              onChange={setRemainingAmountIsCurrencyDifference}
            >
              Restbetrag als Währungsdifferenz buchen
            </Checkbox>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Button id="dialog-cancel-button" variant="outline" onClick={() => renderProps.close()}>
              Abbrechen
            </Button>

            <Button type="button" onClick={handleSaveClicked}>
              Speichern
            </Button>
          </div>
        </div>
      )}
    >
      <div className="overflow-hidden">
        {transactions?.length ? (
          <DataTable<App.Data.TransactionData, unknown>
            columns={columns}
            onSelectedRowsChange={setSelectedRows}
            data={transactions}
            itemName="Transaktionen"
          />
        ) : (
          'Keine Transaktionen gefunden'
        )}
      </div>
    </Dialog>
  )
}

export default ReceiptLinkTransactions
