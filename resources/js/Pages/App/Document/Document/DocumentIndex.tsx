import { FolderFileStorageIcon, FolderUploadIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { createContext, useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
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
import { Select } from '@/Components/twc-ui/select'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { DocumentMutliDocUpload } from '@/Pages/App/Document/Document/DocumentMutliDocUpload'
import type { PageProps } from '@/Types'
import { DocumentIndexFile } from './DocumentIndexFile'

interface DocumentIndexPageProps extends PageProps {
  documents: App.Data.Paginated.PaginationMeta<App.Data.DocumentData[]>
  documentTypes: App.Data.DocumentTypeData[]
  currentFilters?: FilterConfig
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
}

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }> | Record<string, never>
  boolean?: 'AND' | 'OR'
}

export const DocumentIndexContext = createContext<{
  selectedDocuments: number[]
  setSelectedDocuments: (documents: number[]) => void
}>({
  selectedDocuments: [],
  setSelectedDocuments: () => {}
})

const DocumentIndex: React.FC<DocumentIndexPageProps> = ({
  documents,
  documentTypes,
  contacts,
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

  const onClick = async (document: App.Data.DocumentData) => {
    console.log(route('app.documents.documents.pdf', { id: document.id }))
    await PdfViewer.call({
      file: route('app.documents.documents.pdf', { id: document.id }),
      filename: document.filename
    })
  }
  const handleFiltersChange = (newFilters: FilterConfig) => {
    router.post(
      route('app.documents.documents.index'),
      {
        filters: newFilters
      },
      {
        preserveScroll: true,
        preserveState: true,
        only: ['documents'],
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
    const filters = route().params.filters as unknown as FilterConfig['filters'] | undefined
    const view = filters?.view?.value
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

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <ToolbarButton
          variant="primary"
          icon={FolderUploadIcon}
          title="MultiDoc hochladen"
          onClick={() => setShowMultiDocUpload(true)}
        />
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
        <div className="mb-6 grid grid-cols-6 gap-4">
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
        <div className="py-3 text-sm">
          {documents.from} - {documents.to} / {documents.total} Dokumenten
          {selectedDocuments.length > 0 && (
            <span>&mdash; {selectedDocuments.length} ausgewählt</span>
          )}
        </div>
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
                href={route('app.documents.documents.upload-form')}
                title="Dokument hochladen"
              />
            </EmptyContent>
          </Empty>
        )}
        <div className="mb-4 flex grid min-h-0 grid-cols-6 flex-wrap items-start justify-start gap-4">
          {documents.data.map(document => (
            <DocumentIndexFile
              document={document}
              key={document.id}
              onClick={document => onClick(document)}
            />
          ))}
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
