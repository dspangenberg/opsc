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
  invoices: App.Data.Paginated.PaginationMeta<App.Data.InvoiceData[]>
  transaction: App.Data.TransactionData | null
}

export const TransactionPayInvoice: React.FC<Props> = ({ invoices, transaction }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedRows, setSelectedRows] = useState<App.Data.TransactionData[]>([])

  const handleOnClosed = () => {
    setIsOpen(false)
  }

  console.log(invoices)

  const handleSaveClicked = () => {}

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
      {transaction?.purpose}
      <DataTable<App.Data.InvoiceData, unknown>
        columns={columns}
        data={invoices.data}
        itemName="Transaktionen"
      />
    </Dialog>
  )
}

export default TransactionPayInvoice
