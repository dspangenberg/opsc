import { useMemo, useState } from 'react'
import type * as React from 'react'
import { useModalStack } from '@inertiaui/modal-react'
import {
  MoreVerticalIcon,
  PencilEdit02Icon,
  EditTableIcon,
  PrinterIcon
} from '@hugeicons/core-free-icons'
import { PageContainer } from '@/Components/PageContainer'
import {
  Toolbar,
  ToolbarButton,
  YkToolbarButton,
  ToolbarDropDownButton,
  Button
} from '@dspangenberg/twcui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import { ClassicNavTabsTab } from '@/Components/ClassicNavTabs'

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

  const title = `RG-${invoice.formated_invoice_number}`

  const tabs = useMemo(
    () => (
      <>
        <ClassicNavTabsTab href={route('app.invoice.index')} activeRoute="/app/invoices">
          Rechnungsdaten
        </ClassicNavTabsTab>

        <ClassicNavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
          Buchungen
        </ClassicNavTabsTab>
      </>
    ),
    []
  )

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none space-x-1">
        <ToolbarButton variant="default" icon={EditTableIcon} title="Positionen bearbeiten" />
        <ToolbarButton icon={PencilEdit02Icon} title="Stammdaten bearbeiten" />
        <ToolbarButton icon={PrinterIcon} title="Drucken" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <YkToolbarButton asChild>
              <Button
                variant="ghost"
                tooltip=""
                size="icon"
                icon={MoreVerticalIcon}
                className="text-primary"
              />
            </YkToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <HugeiconsIcon icon={PrinterIcon} />
              Drucken &hellip;
            </DropdownMenuItem>
            <DropdownMenuItem>x</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Toolbar>
    ),
    []
  )

  return (
    <PageContainer
      title={title}
      width="7xl"
      tabs={tabs}
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex gap-4"
      toolbar={toolbar}
    >
      {children}
    </PageContainer>
  )
}
