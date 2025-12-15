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
  RepeatIcon,
  Sent02Icon,
  UnavailableIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import print from 'print-js'
import type * as React from 'react'
import { useCallback, useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import {
  DropdownButton,
  Menu,
  MenuItem,
  MenuPopover,
  MenuSubTrigger
} from '@/Components/twcui/dropdown-button'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { PdfViewer } from '@/Components/ui/twc-ui/pdf-viewer'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import { Toolbar, ToolbarButton } from '@/Components/ui/twc-ui/toolbar'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { InvoiceTableProvider, useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

interface Props {
  invoice: App.Data.InvoiceData
  children: React.ReactNode
}

const InvoiceDetailsLayoutContent: React.FC<Props> = ({ invoice, children }) => {
  const onPrintPdf = () => {
    print(route('app.invoice.pdf', { id: invoice.id }))
  }

  const { editMode, setEditMode } = useInvoiceTable()

  const handleEditBaseDataButtonClick = () => {
    router.visit(
      route('app.invoice.base-edit', {
        invoice: invoice.id
      })
    )
  }

  const handleOpenPdf = async () => {
    await PdfViewer.call({
      file: route('app.invoice.pdf', { id: invoice.id }),
      filename: invoice.filename || 'invoice.pdf'
    })
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
    route: route('app.invoice.pdf', { id: invoice.id }),
    filename: invoice.filename || 'invoice.pdf'
  })

  const handleDuplicate = () => {
    router.get(route('app.invoice.duplicate', { id: invoice.id }))
  }

  const handlePaymentCreateClicked = () => {
    router.visit(route('app.invoice.create.payment', { id: invoice.id }))
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
              variant="primary"
              icon={EditTableIcon}
              title="Positionen bearbeiten"
              onClick={() => setEditMode(true)}
            />
            <ToolbarButton
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

        <ToolbarButton icon={Pdf02Icon} title="PDF-Vorschau" onClick={() => handleOpenPdf()} />

        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} isDisabled={editMode}>
          {invoice.is_draft && (
            <>
              <MenuItem
                icon={Edit03Icon}
                title="Stammdaten bearbeiten"
                ellipsis
                onAction={handleEditBaseDataButtonClick}
              />
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
          <MenuItem
            icon={Pdf02Icon}
            title="PDF-Vorschau"
            ellipsis
            onAction={() => handleOpenPdf()}
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

          <MenuItem
            icon={EuroReceiveIcon}
            title="Zahlung zuordnen"
            ellipsis
            separator
            onClick={handlePaymentCreateClicked}
          />
          <MenuSubTrigger>
            <MenuItem title="Erweitert" />
            <MenuPopover>
              <Menu>
                <MenuItem
                  disabled={invoice.is_draft || !!invoice.sent_at}
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
                  variant="destructive"
                  disabled={!invoice.is_draft}
                  onAction={handleDelete}
                />
                <MenuItem
                  title="Rechnung buchen"
                  href={route('app.invoice.booking-create', { invoice })}
                  disabled={!invoice.sent_at || !!invoice.booking?.id}
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
      title={title}
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
