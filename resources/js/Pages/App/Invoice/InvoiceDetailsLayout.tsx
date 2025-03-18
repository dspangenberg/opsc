import { useMemo } from 'react'
import type * as React from 'react'
import { useModalStack } from '@inertiaui/modal-react'
import { NoteEditIcon, PrinterIcon } from '@hugeicons/core-free-icons'
import { PageContainer } from '@/Components/PageContainer'
import { Toolbar, ToolbarButton } from '@dspangenberg/twcui'

interface Props {
  invoice: App.Data.InvoiceData
  children: React.ReactNode
}

export const InvoiceDetailsLayout: React.FC<Props> = ({ invoice, children }) => {
  const { visitModal } = useModalStack()

  const breadcrumbs = useMemo(
    () => [
      { title: 'Rechnungen', route: route('app.invoice.index') },
      {
        title: invoice.formated_invoice_number,
        route: route('app.invoice.details', { id: invoice.id })
      }
    ],
    [invoice.formated_invoice_number]
  )

  const title = `${invoice.type?.display_name} RG-${invoice.formated_invoice_number}`

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={NoteEditIcon} title="Bearbeiten" />
        <ToolbarButton icon={PrinterIcon} />
      </Toolbar>
    ),
    []
  )

  return (
    <PageContainer
      title={title}
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex gap-4"
      toolbar={toolbar}
    >
      {children}
    </PageContainer>
  )
}
