import {
  Delete02Icon,
  DocumentValidationIcon,
  Edit03Icon,
  EditTableIcon,
  FileDownloadIcon,
  FileEditIcon,
  FileEuroIcon,
  Files02Icon,
  LegalDocument02Icon,
  MoreVerticalCircle01Icon,
  Pdf02Icon,
  PrinterIcon,
  Sent02Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import print from 'print-js'
import type * as React from 'react'
import { useCallback, useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { Tab, TabList, Tabs } from '@/Components/twc-ui/tabs'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { useFileDownload } from '@/Hooks/use-file-download'
import { OfferTableProvider, useOfferTable } from './OfferTableProvider'

interface Props {
  offer: App.Data.OfferData
  children: React.ReactNode
  termsEditMode?: boolean
  onTermsEditModeChange?: (editMode: boolean) => void
}

const OfferDetailsLayoutContent: React.FC<Props> = ({
  offer,
  children,
  termsEditMode,
  ...props
}) => {
  const onPrintPdf = () => {
    print(route('app.offer.pdf', { id: offer.id }))
  }

  const onShowPdf = async () => {
    await PdfViewer.call({
      file: route('app.offer.pdf', { id: offer.id }),
      filename: offer.filename || 'offer.pdf'
    })
  }

  const { editMode, setEditMode } = useOfferTable()

  const handleCreateInvoice = () => {
    router.post(route('app.offer.create-invoice', { offer: offer.id }))
  }

  const handleEditBaseDataButtonClick = () => {
    router.visit(
      route('app.offer.edit', {
        offer: offer.id
      })
    )
  }

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Angebote',
        url: route('app.offer.index')
      },
      {
        title: offer.formated_offer_number
      }
    ],
    [offer.formated_offer_number]
  )

  const title = `AG-${offer.formated_offer_number}`

  const { handleDownload } = useFileDownload({
    route: route('app.offer.pdf', { id: offer.id }),
    filename: offer.filename || 'offer.pdf'
  })

  const handleRelease = useCallback(async () => {
    const promise = await AlertDialog.call({
      title: 'Angebot abschließen',
      message: 'Möchtest Du das Angebot wirklich abschließen?',
      buttonTitle: 'Angebot abschließen',
      variant: 'default'
    })

    if (promise) {
      router.put(route('app.offer.release', { id: offer.id }))
    }
  }, [offer.id])

  const handleDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Angebot löschen',
      message: 'Möchtest Du das Angebot wirklich löschen?',
      buttonTitle: 'Angebot löschen'
    })
    if (promise) {
      router.delete(route('app.offer.destroy', { id: offer.id }))
    }
  }

  const handleMarkAsSent = () => {
    router.put(route('app.offer.mark-as-sent', { id: offer.id }))
  }

  const handleUnrelease = () => {
    router.put(route('app.offer.unrelease', { id: offer.id }))
  }

  const currentRoute = route().current()

  const tabs = useMemo(
    () => (
      <Tabs variant="underlined" defaultSelectedKey={currentRoute}>
        <TabList aria-label="Ansicht">
          <Tab id="app.offer.details" href={route('app.offer.details', { offer }, false)}>
            Angebotspositionen
          </Tab>
          <Tab id="app.offer.terms" href={route('app.offer.terms', { offer }, false)}>
            Bedingungen
          </Tab>
          <Tab id="app.offer.history" href={route('app.offer.history', { offer }, false)}>
            Historie
          </Tab>
        </TabList>
      </Tabs>
    ),
    [currentRoute, offer]
  )

  const setTermsEditMode = (value: boolean) => {
    props?.onTermsEditModeChange?.(value)
  }

  const toolbar = useMemo(
    () => (
      <Toolbar isDisabled={editMode || termsEditMode}>
        {!offer.is_draft && !offer.sent_at && (
          <ToolbarButton variant="primary" icon={Sent02Icon} title="Angebot per E-Mail versenden" />
        )}
        {offer.is_draft && currentRoute === 'app.offer.terms' && (
          <ToolbarButton
            icon={LegalDocument02Icon}
            variant="primary"
            title="Bedingungen bearbeiten"
            isDisabled={termsEditMode}
            onClick={() => setTermsEditMode(true)}
          />
        )}
        {offer.is_draft && currentRoute === 'app.offer.details' && (
          <ToolbarButton
            icon={EditTableIcon}
            variant="primary"
            title="Positionen bearbeiten"
            onClick={() => setEditMode(true)}
          />
        )}
        {offer.is_draft && (
          <>
            <ToolbarButton
              variant="default"
              icon={Edit03Icon}
              title="Stammdaten bearbeiten"
              onClick={handleEditBaseDataButtonClick}
            />
            <ToolbarButton
              icon={DocumentValidationIcon}
              title="Angebot abschließen"
              onClick={handleRelease}
            />
          </>
        )}

        <ToolbarButton icon={Pdf02Icon} title="PDF-Vorschau" onClick={() => onShowPdf()} />

        <DropdownButton
          variant="toolbar"
          icon={MoreVerticalCircle01Icon}
          isDisabled={editMode || termsEditMode}
        >
          {offer.is_draft && (
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
              <MenuItem
                icon={DocumentValidationIcon}
                title="Angebot abschließen"
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
            title="Angebot drucken"
            ellipsis
            separator
            onAction={onPrintPdf}
          />
          <MenuItem
            isDisabled={offer.is_draft || !!offer.sent_at}
            icon={Sent02Icon}
            title="Angebot per E-Mail versenden"
            ellipsis
            separator
          />
          <MenuItem
            isDisabled={offer.is_draft || !!offer.sent_at}
            icon={Sent02Icon}
            title="Als versendet markieren"
            separator
            onAction={handleMarkAsSent}
          />
          <MenuItem
            icon={Files02Icon}
            title="Angebot duplizieren"
            separator
            href={route('app.offer.duplicate', { offer: offer.id })}
          />
          <MenuItem
            icon={FileEditIcon}
            title="Angebot korrigieren"
            onAction={handleUnrelease}
            isDisabled={!offer.is_draft && !!offer.sent_at}
          />
          <MenuItem
            icon={Delete02Icon}
            title="Angebot löschen"
            separator
            variant="destructive"
            isDisabled={!offer.is_draft}
            onAction={handleDelete}
          />

          <MenuItem icon={FileEuroIcon} title="Rechnung erstellen" onAction={handleCreateInvoice} />
        </DropdownButton>
      </Toolbar>
    ),
    [
      editMode,
      termsEditMode,
      handleDownload,
      offer.sent_at,
      handleRelease,
      setEditMode,
      currentRoute,
      offer.is_draft,
      offer.id
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

export const OfferDetailsLayout: React.FC<Props> = ({ offer, children, ...props }) => {
  return (
    <OfferTableProvider>
      <OfferDetailsLayoutContent offer={offer} {...props}>
        {children}
      </OfferDetailsLayoutContent>
    </OfferTableProvider>
  )
}
