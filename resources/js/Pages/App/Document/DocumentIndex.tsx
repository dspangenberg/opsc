import {
  Doc02Icon,
  File02Icon,
  FolderFileStorageIcon,
  FolderUploadIcon,
  GridViewIcon,
  Group01Icon,
  Refresh04Icon
} from '@hugeicons/core-free-icons'
import { InfiniteScroll, router } from '@inertiajs/react'
import * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Group } from 'react-aria-components'
import { PageContainer } from '@/Components/PageContainer'
import { BookmarkMenu } from '@/Components/Shared/Bookmark/BookmarkMenu'
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
import { SearchField } from '@/Components/twc-ui/search-field'
import { ToggleButtonGroup, ToggleButtonGroupItem } from '@/Components/twc-ui/toggle-button-group'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { BulkActions } from '@/Pages/App/Document/_Components/BulkActions'
import { FilterForm } from '@/Pages/App/Document/_Components/FilterForm'
import {
  encodeFilter,
  type FilterState,
  parseFilterTree
} from '@/Pages/App/Document/_Components/filterTree'
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
  filterTags: App.Data.DocumentTagData[]
  currentSearch: string
  bookmark_model: string
  bookmarks: App.Data.BookmarkData[]
}

const DocumentIndex: React.FC<DocumentIndexPageProps> = ({
  documents,
  documentTypes,
  bookmark_model,
  bookmarks,
  contacts,
  filterContacts,
  filterProjects,
  filterTypes,
  filterTags,
  projects,
  currentSearch = ''
}) => {
  const breadcrumbs = useMemo(() => [{ title: 'Dokumente' }], [])
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [showMultiDocUpload, setShowMultiDocUpload] = useState(false)
  const [search, setSearch] = useState(currentSearch)
  const [filterState, setFilterState] = useState<FilterState>(() =>
    parseFilterTree(route().params.filter as unknown)
  )
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(filterState)
  const [viewType, setViewType] = useState<Set<string>>(new Set(['grouped']))
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchRef = useRef(currentSearch)

  const pinnedDocuments = documents.data.filter(document => document.is_pinned)
  const unpinnedDocuments = documents.data.filter(document => !document.is_pinned)

  const documentsGroupedByFolder = Object.groupBy(unpinnedDocuments, ({ folder }) => folder)
  const folders = Object.keys(documentsGroupedByFolder)
  const getDocumentsByFolder = (folder: string) => documentsGroupedByFolder[folder]

  const getViewTitle = () => {
    switch (route().params?.view) {
      case 'trash':
        return 'Papierkorb'
      case 'inbox':
        return 'Inbox'
      default:
        return 'Dokumente'
    }
  }

  const view = getViewTitle()
  const isTrash = route().params?.view === 'trash'
  const isInbox = route().params?.view === 'inbox'

  const isFilterDirty = encodeFilter(filterState) !== encodeFilter(appliedFilter)

  const visitIndex = useCallback((state: FilterState, term: string) => {
    const view = route().params?.view

    router.get(
      route('app.document.index'),
      {
        filter: encodeFilter(state),
        search: term,
        ...(view ? { view } : {})
      },
      {
        preserveScroll: true,
        preserveState: true,
        only: ['documents'],
        reset: ['documents']
      }
    )
  }, [])

  const debouncedSearchChange = useCallback(
    (newSearch: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }

      searchTimeoutRef.current = setTimeout(() => visitIndex(appliedFilter, newSearch), 500) // 500ms Debounce
    },
    [appliedFilter, visitIndex]
  )

  const handleSearchInputChange = useCallback(
    (newSearch: string) => {
      setSearch(newSearch)
      searchRef.current = newSearch
      debouncedSearchChange(newSearch)
    },
    [debouncedSearchChange]
  )

  const handleFilterStateChange = (newState: FilterState) => setFilterState(newState)

  const handleApplyFilters = useCallback(() => {
    setAppliedFilter(filterState)
    visitIndex(filterState, searchRef.current)
  }, [filterState, visitIndex])

  const handleCreateLetter = () => router.visit(route('app.document.create-letter'))

  const toolbar = (
    <Toolbar>
      <ToolbarButton
        variant="primary"
        icon={FolderUploadIcon}
        title="MultiDoc hochladen"
        onClick={() => setShowMultiDocUpload(true)}
      />
      <ToolbarButton icon={Doc02Icon} title="MultiDoc hochladen" onClick={handleCreateLetter} />
      {isInbox && (
        <ToolbarButton icon={Refresh04Icon} title="Aktualisieren" onClick={() => router.reload()} />
      )}
    </Toolbar>
  )

  const handleBookmarkUpdate = () => {
    router.reload({ only: ['bookmarks'] })
  }

  return (
    <DocumentIndexContext.Provider value={{ selectedDocuments, setSelectedDocuments }}>
      <PageContainer
        title={view}
        width="7xl"
        toolbar={toolbar}
        breadcrumbs={breadcrumbs}
        contentHeader={
          <Toolbar variant="default" className="mx-4 flex-1 items-center gap-2">
            <Group
              aria-label="Bulk-Aktionen und Filter"
              className="flex flex-1 gap-1"
              style={{ flexDirection: 'inherit' }}
            >
              <Checkbox
                name={`document-selection-all`}
                label={`1 bis ${documents.to ?? 0} von ${documents.total} Dokumenten`}
                isSelected={
                  documents.data.length > 0 && selectedDocuments.length === documents.data.length
                }
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
              <BulkActions
                trash={isTrash}
                contacts={contacts}
                projects={projects}
                documentTypes={documentTypes}
              />
              <BookmarkMenu
                bookmarks={bookmarks}
                icon={File02Icon}
                model={bookmark_model}
                onUpdate={handleBookmarkUpdate}
              />
              <FilterForm
                contacts={filterContacts}
                projects={filterProjects}
                tags={filterTags}
                types={filterTypes}
                state={filterState}
                isDirty={isFilterDirty}
                onStateChange={handleFilterStateChange}
                onApply={handleApplyFilters}
              />
            </Group>
            <Group aria-label="Ansichtsoptionen" className="flex items-center gap-4">
              <SearchField
                aria-label="Suchen"
                placeholder="Suchen …"
                value={search}
                onChange={handleSearchInputChange}
                className="w-xs justify-end"
              />
              <ToggleButtonGroup
                variant="toggle"
                selectedKeys={viewType}
                onSelectionChange={keys => setViewType(new Set(keys) as Set<string>)}
              >
                <ToggleButtonGroupItem
                  id="grouped"
                  icon={Group01Icon}
                  tooltip="Nach Jahr/Monat gruppiert"
                />
                <ToggleButtonGroupItem id="grid" icon={GridViewIcon} tooltip="Ungruppiertes Grid" />
              </ToggleButtonGroup>
            </Group>
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
              <EmptyDescription>{view} enthält keine Dokumente</EmptyDescription>
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
          {pinnedDocuments.length > 0 && (
            <>
              {viewType.has('grouped') && (
                <div className="col-span-6 mt-3 font-semibold text-base">Angepinnte Dokumente</div>
              )}
              {pinnedDocuments.map($document => (
                <DocumentIndexFile document={$document} key={$document.id} />
              ))}
            </>
          )}

          {viewType.has('grouped')
            ? folders.map(folder => (
                <React.Fragment key={folder}>
                  <div className="col-span-6 mt-3 font-semibold text-base">{folder}</div>
                  {getDocumentsByFolder(folder)?.map(document => (
                    <DocumentIndexFile document={document} key={document.id} />
                  ))}
                </React.Fragment>
              ))
            : unpinnedDocuments.map(document => (
                <DocumentIndexFile document={document} key={document.id} />
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
