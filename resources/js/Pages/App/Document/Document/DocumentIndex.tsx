import {
  Delete01Icon,
  Delete04Icon,
  DeletePutBackIcon,
  FolderFileStorageIcon,
  FolderUploadIcon,
  Refresh04Icon
} from '@hugeicons/core-free-icons'
import { router, WhenVisible } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'

import { Checkbox } from '@/Components/twc-ui/checkbox'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/Components/twc-ui/empty'
import { Icon } from '@/Components/twc-ui/icon'
import { LinkButton } from '@/Components/twc-ui/link-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { Select } from '@/Components/twc-ui/select'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { DocumentMutliDocUpload } from '@/Pages/App/Document/Document/DocumentMutliDocUpload'
import type { PageProps } from '@/Types'
import { DocumentIndexContext } from './DocumentIndexContext'
import { DocumentIndexFile } from './DocumentIndexFile'

interface DocumentIndexPageProps extends PageProps {
  documents: App.Data.DocumentData[]
  documentTypes: App.Data.DocumentTypeData[]
  currentFilters?: FilterConfig
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
  from: number
  to: number
  total: number
  page: number
  isNextPage: boolean
}

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }> | Record<string, never>
  boolean?: 'AND' | 'OR'
}

const DocumentIndex: React.FC<DocumentIndexPageProps> = ({
  documents,
  documentTypes,
  contacts,
  page,
  total,
  from,
  to,
  isNextPage,
  projects,
  currentFilters = { filters: {}, boolean: 'AND' }
}) => {
  const breadcrumbs = useMemo(() => [{ title: 'Dokumente' }], [])
  const [documentType, setDocumentType] = useState<number | null>(null)
  const [contactId, setContactId] = useState<number | null>(null)
  const [projectId, setProjectId] = useState<number | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [showMultiDocUpload, setShowMultiDocUpload] = useState(false)

  const [filters, setFilters] = useState<FilterConfig>(currentFilters)
  const routeFilters = route().params.filters as unknown as FilterConfig['filters'] | undefined

  const onClick = async (document: App.Data.DocumentData) => {
    await PdfViewer.call({
      file: route('app.document.pdf', { id: document.id }),
      filename: document.filename
    })
  }
  const handleFiltersChange = (newFilters: FilterConfig) => {
    router.post(
      route('app.document.index'),
      {
        filters: newFilters,
        page: 1
      },
      {
        replace: true,
        preserveState: false,
        onSuccess: () => {
          setFilters(newFilters)
        }
      }
    )
  }

  const buildFilters = (
    typeId: number | null,
    contactIdValue: number | null,
    projectIdValue: number | null
  ): FilterConfig => {
    const newFilters: Record<string, { operator: string; value: any }> = {}

    if (typeId !== null) {
      newFilters.document_type_id = {
        operator: '=',
        value: typeId
      }
    }

    if (contactIdValue !== null) {
      newFilters.contact_id = {
        operator: '=',
        value: contactIdValue
      }
    }

    if (projectIdValue !== null) {
      newFilters.project_id = {
        operator: '=',
        value: projectIdValue
      }
    }

    return {
      filters: newFilters,
      boolean: 'AND'
    }
  }

  const handleDocumentTypeChange = (id: number | null) => {
    setDocumentType(id)
    const newFilters = buildFilters(id, contactId, projectId)
    handleFiltersChange(newFilters)
  }

  const handleContactChange = (id: number | null) => {
    setContactId(id)
    const newFilters = buildFilters(documentType, id, projectId)
    handleFiltersChange(newFilters)
  }

  const handleProjectChange = (id: number | null) => {
    setProjectId(id)
    const newFilters = buildFilters(documentType, contactId, id)
    handleFiltersChange(newFilters)
  }

  const folder = () => {
    const view = routeFilters?.view?.value
    switch (view) {
      case 'trash':
        return 'Papierkorb'
      case 'inbox':
        return 'Inbox'
    }

    const criteria: string[] = []
    if (documentType)
      criteria.push(`Dokumenttyp=${documentTypes.find(item => item.id === documentType)?.name}`)
    if (contactId)
      criteria.push(`Kontakt=${contacts.find(item => item.id === contactId)?.full_name}`)
    if (projectId) criteria.push(`Projekt=${projects.find(item => item.id === projectId)?.name}`)
    return criteria.toLocaleString()
  }

  const isTrash = routeFilters?.view?.value === 'trash'
  const isInbox = routeFilters?.view?.value === 'inbox'

  const handleForceDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente endgültig löschen',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich endgültig löschen?`,
      buttonTitle: 'Endgültig löschen'
    })
    if (promise) {
      router.delete(
        route('app.document.bulk-force-delete', {
          _query: {
            document_ids: selectedDocuments.join(',')
          }
        })
      )
    }
  }

  const handleBulkRestore = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente wiederherstellen',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich wiederherstellen?`,
      buttonTitle: 'Dokumente wiederherstellen'
    })
    if (promise) {
      router.put(
        route('app.document.bulk-restore'),
        { ids: selectedDocuments.join(',') },
        {
          onSuccess: () => setSelectedDocuments([])
        }
      )
    }
  }

  const handleBulkMoveToTrash = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente in den Papierkorb verschieben',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich in den Papierkorb verschieben?`,
      buttonTitle: 'In den Papierkorb verschieben'
    })
    if (promise) {
      router.put(
        route('app.document.bulk-move-to-trash'),
        { ids: selectedDocuments.join(',') },
        {
          onSuccess: () => setSelectedDocuments([])
        }
      )
    }
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <ToolbarButton
          variant="primary"
          icon={FolderUploadIcon}
          title="MultiDoc hochladen"
          onClick={() => setShowMultiDocUpload(true)}
        />
        {isInbox && (
          <ToolbarButton
            icon={Refresh04Icon}
            title="Aktualisieren"
            onClick={() => router.reload()}
          />
        )}
      </Toolbar>
    ),
    []
  )

  return (
    <DocumentIndexContext.Provider value={{ selectedDocuments, setSelectedDocuments }}>
      <PageContainer
        title="Dokumente"
        width="7xl"
        toolbar={toolbar}
        breadcrumbs={breadcrumbs}
        className="overflow-hidden"
      >
        <div className="relative mb-6 grid grid-cols-6 gap-4">
          <Select
            label="Dokumenttyp"
            value={documentType}
            items={documentTypes}
            onChange={value => handleDocumentTypeChange(value as number | null)}
            isOptional
          />
          <Select
            label="Kontakt"
            value={contactId}
            items={contacts}
            itemName="reverse_full_name"
            onChange={value => handleContactChange(value as number | null)}
            isOptional
          />
          <Select
            label="Projekt"
            value={projectId}
            items={projects}
            onChange={value => handleProjectChange(value as number | null)}
            isOptional
          />
        </div>

        <Toolbar variant="secondary" className="h-12 flex-1 items-center">
          <Checkbox
            name={`document-selection-all`}
            isSelected={selectedDocuments.length === documents.length}
            onChange={() =>
              setSelectedDocuments(
                selectedDocuments.length === documents.length
                  ? []
                  : documents.map(document => document.id as number)
              )
            }
            isIndeterminate={
              selectedDocuments.length > 0 && selectedDocuments.length !== documents.length
            }
          />

          <div className="items.center flex">
            {from} - {to} / {total} Dokumenten
          </div>
          {selectedDocuments.length > 0 && (
            <>
              <div>&mdash; {selectedDocuments.length} ausgewählt</div>
              <DropdownButton title="Ausgewählte Dokumente" variant="outline" size="default">
                {isTrash ? (
                  <>
                    <MenuItem
                      icon={DeletePutBackIcon}
                      title="Wiederherstellen"
                      onClick={() => handleBulkRestore()}
                    />
                    <MenuItem
                      icon={Delete04Icon}
                      title="Endgültig löschen"
                      variant="destructive"
                      onClick={() => handleForceDelete()}
                    />
                  </>
                ) : (
                  <MenuItem
                    icon={Delete01Icon}
                    title="In Papierkorb verschieben"
                    variant="destructive"
                    onClick={() => handleBulkMoveToTrash()}
                  />
                )}
              </DropdownButton>
            </>
          )}
        </Toolbar>

        {!total && (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Icon icon={FolderFileStorageIcon} className="size-10 text-gray-400" />
              </EmptyMedia>
              <EmptyTitle>Keine Dokumente gefunden</EmptyTitle>
              <EmptyDescription>{folder()} enthält keine Dokumente</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <LinkButton
                variant="outline"
                size="sm"
                href={route('app.document.upload-form')}
                title="Dokument hochladen"
              />
            </EmptyContent>
          </Empty>
        )}
        <div className="absolute top-32 right-0 bottom-0 left-0 mb-4 grid min-h-0 auto-rows-max grid-cols-6 gap-4 overflow-y-auto">
          {documents.map(document => (
            <DocumentIndexFile
              document={document}
              key={document.id}
              onClick={document => onClick(document)}
            />
          ))}
          {isNextPage && (
            <WhenVisible
              always
              params={{
                data: {
                  page: page + 1
                },
                only: ['documents', 'page', 'isNextPage', 'from', 'to', 'total']
              }}
              fallback={<div />}
            >
              <div />
            </WhenVisible>
          )}
        </div>
        <DocumentMutliDocUpload
          isOpen={showMultiDocUpload}
          onClosed={() => setShowMultiDocUpload(false)}
        />
      </PageContainer>
    </DocumentIndexContext.Provider>
  )
}

export default DocumentIndex
