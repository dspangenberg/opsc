import type * as React from 'react'
import InvoiceDetails from './InvoiceDetails'
import type { PageProps } from '@inertiajs/core'
import { InvoiceDetailsEditLineDialog } from './InvoiceDetailsEditLineDialog'
import { usePage } from '@inertiajs/react'

interface Props extends PageProps {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

const InvoiceDetailsEditLine: React.FC<Props> = ({ invoice, invoiceLine }) => {
  const { auth } = usePage<PageProps>().props
  return (
    <InvoiceDetails invoice={invoice} auth={auth}>
      <InvoiceDetailsEditLineDialog invoice={invoice} invoiceLine={invoiceLine}/>
    </InvoiceDetails>
  )
}

export default InvoiceDetailsEditLine
