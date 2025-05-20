import type * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import {
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EuroReceiveIcon,
  FileDownloadIcon,
  FileEditIcon,
  FileRemoveIcon,
  Files02Icon,
  MoreVerticalIcon,
  Pdf02Icon,
  PrinterIcon,
  RepeatIcon,
  Sent02Icon,
  UnavailableIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton, YkToolbarButton } from '@dspangenberg/twcui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'

import { ClassicNavTabsTab } from '@/Components/ClassicNavTabs'
import { PdfViewer } from '@/Components/PdfViewer'
import print from 'print-js'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { router } from '@inertiajs/react'
import { InvoiceDetailsReleaseConfirm } from '@/Pages/App/Invoice/InvoiceDetailsReleaseConfirm'
import { ConfirmationDialog } from '@/Pages/App/Invoice/ConfirmationDialog'

interface Props {
  invoice: App.Data.InvoiceData
  children: React.ReactNode
}

export const InvoiceDetailsLayout: React.FC<Props> = ({ invoice, children }) => {
  const onPrintPdf = () => {
    print(route('app.invoice.pdf', { id: invoice.id }))
  }

  const handleEditBaseDataButtonClick = () => {
    router.visit(
      route('app.invoice.base-edit', {
        invoice: invoice.id
      })
    )
  }

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

  const handleDuplicate = () => {
    router.get(route('app.invoice.duplicate', { id: invoice.id }))
  }

  const handleRelease = useCallback(async () => {
    const promise = await InvoiceDetailsReleaseConfirm.call({
      invoice
    })

    if (promise) {
      router.get(route('app.invoice.release', { id: invoice.id }))
    }
  }, [invoice])

  const handleDelete = async () => {
    const promise = await ConfirmationDialog.call({
      title: 'Rechnung löschen',
      message: 'Möchtest Du die Rechnung wirklich löschen?',
      buttonTitle: 'Rechnung löschen'
    })
    if (promise) {
      router.delete(route('app.invoice.delete', { id: invoice.id }))
    }
  }

  const handleMarkAsSent = () => {
    router.get(route('app.invoice.mark-as-sent', { id: invoice.id }))
  }

  const handleUnrelease = () => {
    router.get(route('app.invoice.unrelease', { id: invoice.id }))
  }

  const tabs = useMemo(
    () => (
      <>
        <ClassicNavTabsTab href={route('app.invoice.index')} activeRoute="/app/invoices">
          Rechnungsdaten
        </ClassicNavTabsTab>

        <ClassicNavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
          Historie + Buchungen
        </ClassicNavTabsTab>
      </>
    ),
    []
  )

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none space-x-1">
        {!invoice.is_draft && invoice.sent_at && (
          <ToolbarButton variant="default" icon={EuroReceiveIcon} title="Zahlung zuordnen" />
        )}
        {!invoice.is_draft && !invoice.sent_at && (
          <ToolbarButton
            variant="default"
            icon={Sent02Icon}
            title="Rechnung per E-Mail versenden"
          />
        )}
        {invoice.is_draft && (
          <ToolbarButton
            icon={Edit03Icon}
            variant="default"
            title="Stammdaten bearbeiten"
            onClick={handleEditBaseDataButtonClick}
          />
        )}
        {invoice.is_draft && (
          <ToolbarButton
            icon={DocumentValidationIcon}
            title="Rechnung abschließen"
            onClick={handleRelease}
          />
        )}
        <ToolbarButton
          icon={Pdf02Icon}
          title="PDF anzeigen"
          onClick={() => setShowPdfViewer(true)}
        />
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
            {invoice.is_draft && (
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleEditBaseDataButtonClick}>
                  <HugeiconsIcon icon={Edit03Icon} />
                  Stammdaten bearbeiten &hellip;
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleRelease}>
                  <HugeiconsIcon icon={DocumentValidationIcon} />
                  Rechnung abschließen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            )}

            <DropdownMenuItem onClick={() => setShowPdfViewer(true)}>
              <HugeiconsIcon icon={Pdf02Icon} />
              PDF-Vorschau &hellip;
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <HugeiconsIcon icon={FileDownloadIcon} />
              PDF herunterladen &hellip;
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon icon={Sent02Icon} />
              Rechnung per E-Mail versenden &hellip;
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onPrintPdf}>
              <HugeiconsIcon icon={PrinterIcon} />
              Rechnung drucken &hellip;
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon icon={EuroReceiveIcon} />
              Zahlung zuordnen &hellip;
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="size-4" />
                Erweitert
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    disabled={invoice.is_draft || !!invoice.sent_at}
                    onClick={handleMarkAsSent}
                  >
                    <HugeiconsIcon icon={Sent02Icon} />
                    Als versendet markieren
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <HugeiconsIcon icon={Files02Icon} />
                    Rechnung duplizieren &hellip;
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={RepeatIcon} />
                    Wiederkehrende Rechnung &hellip;
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={!invoice.is_draft && !!invoice.sent_at}
                    onClick={handleUnrelease}
                  >
                    <HugeiconsIcon icon={FileEditIcon} />
                    Rechnung korrigieren
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={invoice.is_draft}>
                    <HugeiconsIcon icon={FileRemoveIcon} />
                    Rechnung stornieren &hellip;
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={!invoice.is_draft} onClick={handleDelete}>
                    <HugeiconsIcon icon={Delete02Icon} />
                    Rechnung löschen
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={invoice.is_draft}>
                    <HugeiconsIcon icon={UnavailableIcon} />
                    Als Forderungsverlust markieren
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </Toolbar>
    ),
    [invoice.is_draft, handleDownload, invoice.sent_at, handleRelease]
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
      <PdfViewer
        open={showPdfViewer}
        filename={invoice.filename || 'invoice.pdf'}
        onOpenChange={setShowPdfViewer}
        document={route('app.invoice.pdf', { id: invoice.id })}
      />
      {children}

      <InvoiceDetailsReleaseConfirm.Root />
    </PageContainer>
  )
}
