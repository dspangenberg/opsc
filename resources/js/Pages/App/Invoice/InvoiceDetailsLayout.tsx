import {
  CashbackEuroIcon,
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EditTableIcon,
  EuroReceiveIcon,
  FileDownloadIcon,
  FileEditIcon,
  FileRemoveIcon,
  Files02Icon,
  MoreVerticalCircle01Icon,
  Pdf02Icon,
  PrinterIcon,
  Sent02Icon,
  UnavailableIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import print from 'print-js'
import type * as React from 'react'
import { useCallback, useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Menu, MenuItem, MenuPopover, MenuSubTrigger } from '@/Components/twc-ui/menu'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { Tab, TabList, Tabs } from '@/Components/twc-ui/tabs'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { useFileDownload } from '@/Hooks/use-file-download'
import { InvoiceTableProvider, useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

interface Props {
  invoice: App.Data.InvoiceData
  children: React.ReactNode
}

const InvoiceDetailsLayoutContent: React.FC<Props> = ({ invoice, children }) => {
  const onPrintPdf = () => {
    print(route('app.invoice.pdf', { invoice: invoice.id }))
  }

  const onShowPdf = async () => {
    await PdfViewer.call({
      file: route('app.invoice.pdf', { invoice: invoice.id }),
      filename: invoice.filename || 'invoice.pdf'
    })
  }

  const { editMode, setEditMode } = useInvoiceTable()

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
    [invoice.formated_invoice_number]
  )

  const title = `RG-${invoice.formated_invoice_number}`

  const { handleDownload } = useFileDownload({
    route: route('app.invoice.pdf', { invoice: invoice.id }),
    filename: invoice.filename || 'invoice.pdf'
  })

  const handleDuplicate = () => {
    router.get(route('app.invoice.duplicate', { invoice: invoice.id }))
  }

  const handlePaymentCreateClicked = () => {
    router.visit(route('app.invoice.create.payment', { invoice: invoice.id }))
  }

  const handleRelease = useCallback(async () => {
    const promise = await AlertDialog.call({
      title: 'Rechnung abschließen',
      message: 'Möchtest Du die Rechnung wirklich abschließen?',
      buttonTitle: 'Rechnung abschließen',
      variant: 'default'
    })

    if (promise) {
      router.post(route('app.invoice.release', { invoice: invoice.id }))
    }
  }, [invoice.id])

  const handleDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Rechnung löschen',
      message: 'Möchtest Du die Rechnung wirklich löschen?',
      buttonTitle: 'Rechnung löschen'
    })
    if (promise) {
      router.delete(route('app.invoice.delete', { invoice: invoice.id }))
    }
  }

  const handleMarkAsSent = () => {
    router.post(route('app.invoice.mark-as-sent', { invoice: invoice.id }))
  }

  const handleUnrelease = () => {
    router.post(route('app.invoice.unrelease', { invoice: invoice.id }))
  }

  const handleCancel = async () => {
    const promise = await AlertDialog.call({
      title: 'Rechnung stornieren',
      message: 'Möchtest Du die Rechnung wirklich stornieren?',
      buttonTitle: 'Rechnung stornieren',
      variant: 'destructive'
    })
    if (promise) {
      router.post(route('app.invoice.cancel', { invoice: invoice.id }))
    }
  }

  const handleLostOfRreceivables = async () => {
    const promise = await AlertDialog.call({
      title: 'Forderungsverlust',
      message: 'Möchtest Du die Rechnung als Forderungsverlust markieren?',
      buttonTitle: 'Rechnung als Forderungsverlust makieren',
      variant: 'destructive'
    })
    if (promise) {
      router.put(route('set-loss-of-receivables', { invoice: invoice.id }))
    }
  }

  const currentRoute = route().current()

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
      <Toolbar isDisabled={editMode}>
        {!invoice.is_draft && invoice.sent_at && (
          <ToolbarButton
            variant="primary"
            icon={EuroReceiveIcon}
            title="Zahlung zuordnen"
            onClick={handlePaymentCreateClicked}
          />
        )}
        {!invoice.is_draft && !invoice.sent_at && (
          <ToolbarButton
            variant="primary"
            icon={Sent02Icon}
            title="Rechnung per E-Mail versenden"
          />
        )}
        {invoice.is_draft && (
          <>
            <ToolbarButton
              icon={EditTableIcon}
              variant="primary"
              title="Positionen bearbeiten"
              onClick={() => setEditMode(true)}
            />
            <ToolbarButton
              variant="default"
              icon={Edit03Icon}
              title="Stammdaten bearbeiten"
              onClick={handleEditBaseDataButtonClick}
            />
          </>
        )}
        {invoice.is_draft && (
          <ToolbarButton
            icon={DocumentValidationIcon}
            title="Rechnung abschließen"
            onClick={handleRelease}
          />
        )}

        <ToolbarButton icon={Pdf02Icon} title="PDF-Vorschau" onClick={() => onShowPdf()} />

        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} isDisabled={editMode}>
          <MenuItem
            icon={Edit03Icon}
            title="Stammdaten bearbeiten"
            ellipsis
            separator
            onAction={handleEditBaseDataButtonClick}
          />
          {invoice.is_draft && (
            <>
              <MenuItem
                icon={EditTableIcon}
                title="Positionen bearbeiten"
                ellipsis
                separator
                onAction={() => setEditMode(true)}
              />
              {invoice.type_id === 3 && (
                <MenuItem
                  icon={CashbackEuroIcon}
                  title="Mit Akonto-Zahlung verrechnen"
                  separator
                  isDisabled={invoice.type_id !== 3}
                  href={route('app.invoice.link-on-account-invoice', { invoice: invoice.id })}
                  ellipsis
                />
              )}
              <MenuItem
                icon={DocumentValidationIcon}
                title="Rechnung abschließen"
                ellipsis
                separator
                onAction={handleRelease}
              />
            </>
          )}
          <MenuItem icon={Pdf02Icon} title="PDF-Vorschau" ellipsis onAction={() => onShowPdf()} />
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

          <MenuItem
            icon={EuroReceiveIcon}
            title="Zahlung zuordnen"
            ellipsis
            separator
            isDisabled={invoice.is_draft || !!invoice.sent_at}
            onClick={handlePaymentCreateClicked}
          />
          <MenuSubTrigger>
            <MenuItem title="Erweitert" />
            <MenuPopover>
              <Menu>
                <MenuItem
                  isDisabled={invoice.is_draft || !!invoice.sent_at}
                  icon={Sent02Icon}
                  title="Als versendet markieren"
                  separator
                  onAction={handleMarkAsSent}
                />
                <MenuItem
                  icon={Files02Icon}
                  title="Rechnung duplizieren"
                  separator
                  onAction={handleDuplicate}
                />
                <MenuItem
                  icon={FileEditIcon}
                  title="Rechnung korrigieren"
                  onAction={handleUnrelease}
                  isDisabled={!invoice.is_draft && !!invoice.sent_at}
                />
                <MenuItem
                  icon={FileRemoveIcon}
                  title="Rechnung stornieren"
                  separator
                  onAction={handleCancel}
                  isDisabled={!invoice.sent_at}
                />
                <MenuItem
                  icon={Delete02Icon}
                  title="Rechnung löschen"
                  separator
                  variant="destructive"
                  isDisabled={!invoice.is_draft}
                  onAction={handleDelete}
                />
                <MenuItem
                  title="Rechnung buchen"
                  href={route('app.invoice.booking-create', { invoice })}
                  isDisabled={!invoice.sent_at || !!invoice.booking?.id}
                />
                <MenuItem
                  icon={UnavailableIcon}
                  title="Als Forderungsverlust markieren"
                  onClick={handleLostOfRreceivables}
                  isDisabled={invoice.is_draft}
                />
              </Menu>
            </MenuPopover>
          </MenuSubTrigger>
        </DropdownButton>
      </Toolbar>
    ),
    [
      editMode,
      handleDownload,
      invoice.sent_at,
      handleRelease,
      setEditMode,
      invoice,
      invoice.type_id,
      invoice.id
    ]
  )

  return (
    <PageContainer
      header={
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl">{title}</span>
          {invoice.is_loss_of_receivables && <Badge variant="destructive">Forderungsverlust</Badge>}
        </div>
      }
      width="8xl"
      tabs={tabs}
      breadcrumbs={breadcrumbs}
      className="flex gap-4 overflow-y-auto"
      toolbar={toolbar}
    >
      {children}
    </PageContainer>
  )
}

export const InvoiceDetailsLayout: React.FC<Props> = ({ invoice, children }) => {
  return (
    <InvoiceTableProvider>
      <InvoiceDetailsLayoutContent invoice={invoice}>{children}</InvoiceDetailsLayoutContent>
    </InvoiceTableProvider>
  )
}
