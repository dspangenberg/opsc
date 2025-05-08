import type * as React from 'react'
import { useMemo, useState } from 'react'
import { useModalStack } from '@inertiaui/modal-react'
import {
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EditTableIcon,
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
import { HugeiconsIcon } from '@hugeicons/react'
import { ClassicNavTabsTab } from '@/Components/ClassicNavTabs'
import { PdfViewer } from '@/Components/PdfViewer'
import print from 'print-js'
import { useFileDownload } from '@/Hooks/useFileDownload'


interface Props {
  invoice: App.Data.InvoiceData
  children: React.ReactNode
}

export const InvoiceDetailsLayout: React.FC<Props> = ({ invoice, children }) => {
  const { visitModal } = useModalStack()

  const onPrintPdf = () => {
    print(route('app.invoice.pdf', { id: invoice.id }))
  }

  /*

   */

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
  });

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
        <ToolbarButton variant="default" icon={EditTableIcon} title="Positionen bearbeiten" />
        <ToolbarButton icon={Edit03Icon} title="Stammdaten bearbeiten" />
        <ToolbarButton icon={DocumentValidationIcon} title="Rechnung abschließen" />
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
                <DropdownMenuItem>
                  <HugeiconsIcon icon={DocumentValidationIcon} />
                  Rechnung abschließen
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HugeiconsIcon icon={EditTableIcon} />
                  Positionen bearbeiten &hellip;
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={Edit03Icon} />
                  Stammdaten bearbeiten &hellip;
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
            )}
            <DropdownMenuGroup>

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
            </DropdownMenuGroup>

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
                  <DropdownMenuItem disabled>
                    <HugeiconsIcon icon={Sent02Icon} />
                    Als versendet markieren
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={Files02Icon} />
                    Rechnung duplizieren &hellip;
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={RepeatIcon} />
                    Wiederkehrende Rechnung &hellip;
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <HugeiconsIcon icon={FileEditIcon} />
                    Rechnung korrigieren
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <HugeiconsIcon icon={Delete02Icon} />
                    Rechnung löschen
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon icon={FileRemoveIcon} />
                    Rechnung stornieren &hellip;
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
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
    [invoice.is_draft, handleDownload]
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
    </PageContainer>
  )
}
