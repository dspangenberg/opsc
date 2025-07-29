import { PageContainer } from '@/Components/PageContainer'
import { PdfViewer } from '@/Components/PdfViewer'
import {
  DropdownButton,
  Menu,
  MenuItem,
  MenuPopover,
  MenuSubTrigger
} from '@/Components/twcui/dropdown-button'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Button } from '@/Components/ui/twc-ui/button'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { useFileDownload } from '@/Hooks/useFileDownload'
import {
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EuroReceiveIcon,
  FileDownloadIcon,
  FileEditIcon,
  FileRemoveIcon,
  Files02Icon,
  MoreVerticalCircle01Icon,
  Pdf02Icon,
  PrinterIcon,
  RepeatIcon,
  Sent02Icon,
  UnavailableIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import print from 'print-js'
import type * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

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
      {
        title: 'Rechnungen',
        url: route('app.invoice.index')
      },
      {
        title: invoice.formated_invoice_number
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
    const promise = await AlertDialog.call({
      title: 'Rechnung abschließen',
      message: 'Möchtest Du die Rechnung wirklich abschließen?',
      buttonTitle: 'Rechnung abschließen',
      variant: 'default'
    })

    if (promise) {
      router.get(route('app.invoice.release', { id: invoice.id }))
    }
  }, [invoice.id])

  const handleDelete = async () => {
    const promise = await AlertDialog.call({
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

  const currentRoute = route().current()
  console.log(currentRoute)

  const tabs = useMemo(
    () => (
      <Tabs variant="underlined" defaultSelectedKey={currentRoute}>
        <TabList aria-label="Ansicht">
          <Tab id="app.invoice.details" href={route('app.invoice.details', { invoice }, false)}>
            Details
          </Tab>
          <Tab id="app.invoice.history" href={route('app.invoice.history', { invoice }, false)}>
            Historie + Buchungen
          </Tab>
        </TabList>
      </Tabs>
    ),
    [currentRoute, invoice]
  )

  const toolbar = useMemo(
    () => (
      <Toolbar>
        {!invoice.is_draft && invoice.sent_at && (
          <Button variant="toolbar-default" icon={EuroReceiveIcon} title="Zahlung zuordnen" />
        )}
        {!invoice.is_draft && !invoice.sent_at && (
          <Button
            variant="toolbar-default"
            icon={Sent02Icon}
            title="Rechnung per E-Mail versenden"
          />
        )}
        {invoice.is_draft && (
          <Button
            variant="toolbar-default"
            icon={Edit03Icon}
            title="Rechnung bearbeiten"
            onClick={handleEditBaseDataButtonClick}
          />
        )}
        {invoice.is_draft && (
          <Button
            variant="toolbar"
            icon={DocumentValidationIcon}
            title="Rechnung abschließen"
            onClick={handleRelease}
          />
        )}

        <Button
          variant="toolbar"
          icon={Pdf02Icon}
          title="PDF-Vorschau"
          onClick={() => setShowPdfViewer(true)}
        />

        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon}>
          {invoice.is_draft && (
            <>
              <MenuItem
                icon={Edit03Icon}
                title="Stammdaten bearbeiten"
                ellipsis
                separator
                onAction={handleEditBaseDataButtonClick}
              />
              <MenuItem
                icon={DocumentValidationIcon}
                title="Rechnung abschließen"
                ellipsis
                separator
                onAction={handleRelease}
              />
            </>
          )}
          <MenuItem
            icon={Pdf02Icon}
            title="PDF-Vorschau"
            ellipsis
            onAction={() => setShowPdfViewer(true)}
          />
          <MenuItem
            icon={FileDownloadIcon}
            title="PDF herunterladen"
            ellipsis
            onAction={handleDownload}
          />
          <MenuItem
            icon={PrinterIcon}
            title="Rechnung drucken"
            ellipsis
            separator
            onAction={onPrintPdf}
          />
          <MenuItem icon={Sent02Icon} title="Rechnung per E-Mail versenden" ellipsis separator />

          <MenuItem icon={EuroReceiveIcon} title="Zahlung zuordnen" ellipsis separator />
          <MenuSubTrigger>
            <MenuItem title="Erweitert" />
            <MenuPopover>
              <Menu>
                <MenuItem
                  disabled={invoice.is_draft || !!invoice.sent_at}
                  icon={Sent02Icon}
                  title="Als versendet markieren"
                  shortcut="Cmd+S"
                  separator
                  onAction={handleMarkAsSent}
                />
                <MenuItem
                  icon={Files02Icon}
                  title="Rechnung duplizieren"
                  separator
                  onAction={handleDuplicate}
                />
                <MenuItem icon={RepeatIcon} title="Wiederkehrende Rechnung" separator ellipsis />
                <MenuItem
                  icon={FileEditIcon}
                  title="Rechnung korrigieren"
                  onAction={handleUnrelease}
                  disabled={!invoice.is_draft && !!invoice.sent_at}
                />
                <MenuItem icon={FileRemoveIcon} title="Rechnung stornieren" separator />
                <MenuItem
                  icon={Delete02Icon}
                  title="Rechnung löschen"
                  separator
                  disabled={!invoice.is_draft}
                  onAction={handleDelete}
                />
                <MenuItem
                  icon={UnavailableIcon}
                  title="Als Forderungsverlust markieren"
                  disabled={invoice.is_draft}
                />
              </Menu>
            </MenuPopover>
          </MenuSubTrigger>
        </DropdownButton>
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
      className="flex gap-4 overflow-y-auto"
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
