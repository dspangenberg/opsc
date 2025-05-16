import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import type { PageProps } from '@/Types'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoicingTable } from '@/Pages/App/Invoice/InvoicingTable'
import { InvoiceDetailsEditPosition } from '@/Pages/App/Invoice/InvoiceDetailsEditPosition'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  const handleEditLine = (lineId: number) => {
    // Hier können Sie die Logik zum Bearbeiten der Zeile implementieren
    console.log(`Editing line with id: ${lineId}`);
    const line = invoice.lines?.find((line) => line.id === lineId); // Finden der Zeile mit der entsprechenden ID

    InvoiceDetailsEditPosition.call({invoice: invoice, invoiceLine: line as unknown as App.Data.InvoiceLineData})
  }

  return (
    <>
      <InvoiceDetailsLayout invoice={invoice}>
        <div className="flex-1">
          {children}
          <InvoicingTable invoice={invoice} onEditLine={handleEditLine} />
        </div>
        <div className="w-sm flex-none h-fit space-y-6 px-1">
          <InvoiceDetailsSide invoice={invoice} />
        </div>
        <InvoiceDetailsEditPosition.Root />
      </InvoiceDetailsLayout>
    </>
  )
}

export default InvoiceDetails
