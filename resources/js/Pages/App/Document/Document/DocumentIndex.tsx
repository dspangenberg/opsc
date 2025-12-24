import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { Select } from '@/Components/twc-ui/select'
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

  return (
    <PageContainer
      title="Dokumente"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden"
    >
      <div className="mb-6 flex gap-4">
        <Select
          label="Dokumenttyp"
          value={documentType}
          items={documentTypes}
          onChange={value => handleDocumentTypeChange(value as number | null)}
          className="w-64"
          isOptional
        />
        <Select
          label="Kontakt"
          value={contactId}
          items={contacts}
          onChange={value => handleContactChange(value as number | null)}
          className="w-64"
          isOptional
        />
        <Select
          label="Projekt"
          value={projectId}
          items={projects}
          onChange={value => handleProjectChange(value as number | null)}
          className="w-64"
          isOptional
        />
      </div>
      <div className="mb-4 flex grid min-h-0 grid-cols-6 flex-wrap items-start justify-start gap-4">
        {documents.data.map(document => (
          <DocumentIndexFile
            document={document}
            key={document.id}
            onClick={document => onClick(document)}
          />
        ))}
      </div>
    </PageContainer>
  )
}

export default DocumentIndex
