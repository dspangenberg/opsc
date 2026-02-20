import {
  Delete01Icon,
  Delete04Icon,
  DeletePutBackIcon,
  FileEditIcon,
  FolderFileStorageIcon,
  FolderUploadIcon,
  Refresh04Icon
} from '@hugeicons/core-free-icons'
import { InfiniteScroll, router } from '@inertiajs/react'
import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'

import { Checkbox } from '@/Components/twc-ui/checkbox'

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
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { BulkActions } from '@/Pages/App/Document/_Components/BulkActions'
import { FilterForm } from '@/Pages/App/Document/_Components/FilterForm'
import { DocumentBulkEdit } from '@/Pages/App/Document/DocumentBulkEdit'
import { DocumentMutliDocUpload } from '@/Pages/App/Document/DocumentMutliDocUpload'
import type { PageProps } from '@/Types'
import { DocumentIndexContext } from './DocumentIndexContext'
import { DocumentIndexFile } from './DocumentIndexFile'

interface DocumentIndexPageProps extends PageProps {
  documents: App.Data.Paginated.PaginationMeta<App.Data.DocumentData[]>
  documentTypes: App.Data.DocumentTypeData[]
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
  filterContacts: App.Data.ContactData[]
  filterTypes: App.Data.DocumentTypeData[]
  filterProjects: App.Data.ProjectData[]
  currentFilters: FilterConfig
}

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }> | Record<string, never>
  boolean?: 'AND' | 'OR'
}

const DocumentIndex: React.FC<DocumentIndexPageProps> = ({
  documents,
  documentTypes,
  contacts,
  filterContacts,
  filterTypes,
  filterProjects,
  projects,
  currentFilters
}) => {
  const breadcrumbs = useMemo(() => [{ title: 'Dokumente' }], [])
  const [documentType, setDocumentType] = useState<number | null>(null)
  const [contactId, setContactId] = useState<number | null>(null)
  const [projectId, setProjectId] = useState<number | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [showMultiDocUpload, setShowMultiDocUpload] = useState(false)

  const [filters, setFilters] = useState<FilterConfig>(currentFilters)
  const routeFilters = route().params.filters as unknown as FilterConfig['filters'] | undefined

  const documentsGroupedByFolder = Object.groupBy(documents.data, ({ folder }) => folder)
  const folders = Object.keys(documentsGroupedByFolder)
  const getDocumentsByFolder = (folder: string) => documentsGroupedByFolder[folder]
  const handlePdfViewClick = async (document: App.Data.DocumentData) => {
    await PdfViewer.call({
      file: route('app.document.pdf', { id: document.id }),
      filename: document.filename
    })
  }

  const folder = () => {
    const view = routeFilters?.view?.value
    switch (view) {
      case 'trash':
        return 'Papierkorb'
      case 'inbox':
        return 'Inbox'
      default:
        return 'Dokumente'
    }
  }

  const view = folder()
  const isTrash = routeFilters?.view?.value === 'trash'
  const isInbox = routeFilters?.view?.value === 'inbox'

  const handleBulkEdit = async () => {
    const result = await DocumentBulkEdit.call({
      contacts,
      projects,
      documentTypes
    })
    if (result !== false) {
      // Filter out 0 values before sending
      const filteredResult = Object.fromEntries(
        Object.entries(result).filter(([_, value]) => value !== 0 && value !== null)
      )

      router.put(
        route('app.document.bulk-edit'),
        {
          ids: selectedDocuments.join(','),
          ...filteredResult
        },
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

  const handleFiltersChange = useCallback((newFilters: FilterConfig) => {
    console.log(newFilters)
    setFilters(newFilters)
    /*
      router.post(
        route('app.bookkeeping.receipts.index'),
        {
          ...newFilters,
          search: search
        },
        {
          preserveScroll: true,
          preserveState: true,
          only: ['receipts'],
          onSuccess: () => {
            setFilters(newFilters)
          }
        }
      )
       */
  }, [])

  return (
    <DocumentIndexContext.Provider value={{ selectedDocuments, setSelectedDocuments }}>
      <PageContainer
        title={view}
        width="7xl"
        toolbar={toolbar}
        breadcrumbs={breadcrumbs}
        contentHeader={
          <Toolbar variant="default" className="mx-4 h-12 flex-1 items-center">
            <Checkbox
              name={`document-selection-all`}
              label={`1 bis ${documents.to} von ${documents.total} Dokumenten`}
              isSelected={selectedDocuments.length === documents.data.length}
              onChange={() =>
                setSelectedDocuments(
                  selectedDocuments.length === documents.data.length
                    ? []
                    : documents.data.map(document => document.id as number)
                )
              }
              isIndeterminate={
                selectedDocuments.length > 0 && selectedDocuments.length !== documents.data.length
              }
            />
            <BulkActions trash={isTrash} />
            <FilterForm
              contacts={filterContacts}
              filters={filters}
              projects={filterProjects}
              types={filterTypes}
              onFiltersChange={handleFiltersChange}
            />
          </Toolbar>
        }
      >
        {!documents.total && (
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

        <InfiniteScroll
          buffer={500}
          data="documents"
          className="mb-4 grid min-h-0 auto-rows-max grid-cols-6 gap-4 overflow-y-auto"
        >
          {folders.map(folder => (
            <React.Fragment key={folder}>
              <div className="col-span-6 mt-3 font-semibold text-base">{folder}</div>
              {getDocumentsByFolder(folder)?.map(document => (
                <DocumentIndexFile document={document} key={document.id} />
              ))}
            </React.Fragment>
          ))}
        </InfiniteScroll>

        <DocumentMutliDocUpload
          isOpen={showMultiDocUpload}
          onClosed={() => setShowMultiDocUpload(false)}
        />
      </PageContainer>
    </DocumentIndexContext.Provider>
  )
}

export default DocumentIndex
