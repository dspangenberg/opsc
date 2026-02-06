import { router } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { NumberField } from '@/Components/twc-ui/number-field'
import { TextField } from '@/Components/twc-ui/text-field'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { paymentColumns } from './ReceiptPaymentColumns'
import { columns } from './ReceiptTransactionColumns'

interface Props {
  receipt: App.Data.ReceiptData
  transactions: App.Data.Paginated.PaginationMeta<App.Data.TransactionData[]>
}

export const ReceiptLinkTransactions: React.FC<Props> = ({ receipt, transactions }) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(0)

  const [selectedRows, setSelectedRows] = useState<App.Data.TransactionData[]>([])

  const [remainingAmountIsCurrencyDifference, setRemainingAmountIsCurrencyDifference] =
    useState<boolean>(false)

  const currencyFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  })

  const breadcrumbs = useMemo(
    () => [
      { title: 'Buchhaltung' },
      { title: 'Belege', url: route('app.bookkeeping.receipts.index') },
      {
        title: String(receipt.document_number || receipt.id),
        url: route('app.bookkeeping.receipts.edit', { receipt: receipt.id })
      },
      { title: 'Zahlungen zuweisen' }
    ],
    [receipt.id, receipt.document_number]
  )

  const handleSaveClicked = () => {
    const ids = selectedRows.map(row => row.id).join(',')
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

  const footer = useMemo(() => {
    return <Pagination data={transactions} />
  }, [transactions])

  const actionBar = useMemo(() => {
    const sum = sumBy(selectedRows, 'amount')
    setSelectedAmount(sum)

    return (
      <Toolbar variant="secondary" className="items-center px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <div>
          <Checkbox
            label="Restbetrag als Währungsdifferenz buchen"
            name="remainingAmountIsCurrencyDifference"
            onChange={setRemainingAmountIsCurrencyDifference}
            isSelected={remainingAmountIsCurrencyDifference}
          />
        </div>
        <div>
          <Button variant="default" title="Zahlungen zuweisen" onClick={handleSaveClicked} />
        </div>
        <div className="flex-1 text-right font-medium text-sm">
          {currencyFormatter.format(selectedAmount)}
        </div>
      </Toolbar>
    )
  }, [selectedRows, selectedAmount, remainingAmountIsCurrencyDifference])

  return (
    <PageContainer
      title="Zahlung zu Beleg hinzufügen"
      width="7xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <div className="flex w-full flex-col space-y-3">
        <div>
          <FormCard innerClassName="bg-muted">
            <FormGrid>
              <div className="col-span-3">
                <TextField label="Belegdatum" value={receipt.issued_on} isDisabled />
              </div>
              <div className="col-span-7">
                <TextField label="Kreditor" value={receipt.contact?.full_name} isDisabled />
              </div>
              <div className="col-span-8">
                <TextField label="Referenz" value={receipt.reference} isDisabled />
              </div>
              <div className="col-span-3">
                <NumberField label="Betrag" value={receipt.amount} isDisabled />
              </div>
              <div className="col-span-3">
                <NumberField label="Offener Betrag" value={receipt.open_amount} isDisabled />
              </div>
            </FormGrid>
          </FormCard>
        </div>
        <div className="overflow-hidden">
          <DataTable<App.Data.PaymentData, unknown>
            columns={paymentColumns}
            data={receipt.payable || []}
            itemName="Zahlungen"
          />
        </div>
        <div className="overflow-hidden">
          <DataTable
            columns={columns}
            actionBar={actionBar}
            onSelectedRowsChange={setSelectedRows}
            footer={footer}
            data={transactions.data}
            itemName="Transaktionen"
          />
        </div>
      </div>
    </PageContainer>
  )
}

export default ReceiptLinkTransactions
