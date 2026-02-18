import { Add01Icon, Archive03Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable, type DataTableRef } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { SearchField } from '@/Components/twc-ui/search-field'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import type { PageProps } from '@/Types'
import { columns } from './ContactIndexColumns'

interface ContactIndexProps extends PageProps {
  contacts: App.Data.Paginated.Contact & App.Data.Paginated.PaginationMeta<App.Data.ContactData[]>
  currentSearch?: string
}

const ContactIndex: React.FC<ContactIndexProps> = ({ contacts, currentSearch }) => {
  const [search, setSearch] = useState(currentSearch)
  const [selectedRows, setSelectedRows] = useState<App.Data.ContactData[]>([])
  const tableRef = useRef<DataTableRef>(null)

  const handleAdd = useCallback(() => {
    router.visit(route('app.contact.create', { _query: { view: route().queryParams.view } }))
  }, [])

  const handleBulkArchive = async () => {
    const promise = await AlertDialog.call({
      title: 'Kontakte archivieren',
      message: `Möchtest Du die ausgewählten Kontakte wirklich archivieren?`,
      buttonTitle: 'Archivieren'
    })
    if (promise) {
      router.put(
        route('app.contact.bulk-archive'),
        {
          ids: selectedRows.map(row => row.id).join(',')
        },
        {
          onSuccess: () => tableRef.current?.resetRowSelection()
        }
      )
    }
  }

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Kontakte',
        route: route('app.contact.index')
      }
    ],
    []
  )

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Kontakt hinzufügen"
          onClick={handleAdd}
        />
      </Toolbar>
    ),
    [handleAdd]
  )

  const footer = useMemo(() => <Pagination data={contacts} itemName="Kontakte" />, [contacts])

  const handleSearchInputChange = (newSearch: string) => {
    setSearch(newSearch)
    debouncedSearchChange(newSearch)
  }
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedSearchChange = useCallback((newSearch: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      router.get(
        route('app.contact.index'),
        {
          search: newSearch,
          view: route().queryParams.view
        },
        {
          preserveScroll: true,
          preserveState: true,
          only: ['contacts']
        }
      )
    }, 500) // 500ms Debounce
  }, [])

  const actionBar = useMemo(() => {
    return (
      <Toolbar variant="secondary" className="px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <Button
          variant="ghost"
          size="auto"
          icon={Archive03Icon}
          title="Kontakte archivieren"
          onClick={() => handleBulkArchive()}
        />
      </Toolbar>
    )
  }, [selectedRows.length])

  const filterBar = useMemo(
    () => (
      <div className="flex p-2 pt-0">
        <SearchField
          aria-label="Suchen"
          autoFocus
          placeholder="Nach Vor- oder Nachnamen suchen"
          value={search}
          onChange={handleSearchInputChange}
          className="w-sm"
        />
      </div>
    ),
    [search]
  )

  return (
    <PageContainer
      title="Kontakte"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        ref={tableRef}
        columns={columns}
        data={contacts.data}
        footer={footer}
        filterBar={filterBar}
        onSelectedRowsChange={setSelectedRows}
        actionBar={actionBar}
      />
    </PageContainer>
  )
}

export default ContactIndex
