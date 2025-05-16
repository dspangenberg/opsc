import type * as React from 'react'
import { useMemo, useState } from 'react'
import { ArrowDown01Icon, ArrowLeft01Icon, FloppyDiskIcon, InsertRowIcon, Pdf02Icon } from '@hugeicons/core-free-icons'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton, YkToolbarButton } from '@dspangenberg/twcui'
import { ChevronDown, Plus, Star, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { router } from '@inertiajs/react'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2
})

interface Props {
  invoice: App.Data.InvoiceData
}

const InvoiceDetailsEditLines: React.FC<Props> = ({ invoice }) => {
  const breadcrumbs = useMemo(
    () => [
      { title: 'Rechnungen', route: route('app.invoice.index') },
      {
        title: invoice.formated_invoice_number,
        route: route('app.invoice.details', { id: invoice.id })
      }
    ],
    [invoice.formated_invoice_number, invoice.id]
  )

  const title = `RG-${invoice.formated_invoice_number}`
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  const { handleDownload } = useFileDownload({
    route: route('app.invoice.pdf', { id: invoice.id }),
    filename: invoice.filename || 'invoice.pdf'
  })

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none space-x-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <YkToolbarButton asChild>
              <Button
                variant="ghost"
                tooltip=""
                size="icon"
                icon={InsertRowIcon}
                className="text-primary"
              />
            </YkToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Standardposition</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Position ohne Kalkulation</DropdownMenuItem>
              <DropdownMenuItem>Überschrift</DropdownMenuItem>
              <DropdownMenuItem>Text</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Seitenumbruch</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ToolbarButton
          icon={Pdf02Icon}
          title="PDF anzeigen"
          onClick={() => setShowPdfViewer(true)}
        />
        <ToolbarButton variant="default" icon={FloppyDiskIcon} title="Speichern" />
      </Toolbar>
    ),
    []
  )

  const handleBackClicked = () => {
    router.get(route('app.invoice.details', { id: invoice.id }))
  }

  return (
    <PageContainer
      header={
        <div className="flex gap-2 items-center flex-1">
          <div className="flex flex-none text-xl  items-start flex-col">
            <div className="flex items-center gap-1">
              <Button
                icon={ArrowLeft01Icon}
                variant="ghost"
                size="icon"
                onClick={handleBackClicked}
              />
              <div className="text-base flex flex-col">
                <div className="font-bold text-2xl">{title}</div>
                <div className="flex">
                  <div>Positionen bearbeiten</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex gap-4"
      toolbar={toolbar}
    >
      <div className="flex-1 p-0.5">
        <div className="flex items-center !border-r-transparent">
          <Button variant="outline" className="w-auto !rounded-r-none border-r-transparent" iconClassName="text-primary" icon={InsertRowIcon} title="Position hinzufügen" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={'!rounded-l-none border-l-0'}
              >
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Standardposition</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Position ohne Kalkulation</DropdownMenuItem>
                <DropdownMenuItem>Überschrift</DropdownMenuItem>
                <DropdownMenuItem>Text</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Seitenumbruch</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          {invoice.lines.map((line, index) => (
            <div key={index} className="flex gap-2 border-b text-base border-gray-200">
              <textarea>{line.text}</textarea>
            </div>
          ))}
        </div>
      </div>
      <div className="w-sm flex-none h-fit space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </PageContainer>
  )
}

export default InvoiceDetailsEditLines
