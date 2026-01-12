import { Add01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { SearchField } from '@/Components/twc-ui/search-field'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { columns } from './ContactIndexColumns'

interface ContactIndexProps extends PageProps {
  contacts: App.Data.Paginated.Contact & App.Data.Paginated.PaginationMeta<App.Data.ContactData[]>
  currentSearch?: string
}

const ContactIndex: React.FC<ContactIndexProps> = ({ currentSearch }) => {
  const { contacts } = usePage<ContactIndexProps>().props
  const [search, setSearch] = useState(currentSearch)

  const handleAdd = useCallback(() => {
    router.visit(route('app.contact.create', { _query: { view: route().queryParams.view } }))
  }, [])

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

  const filterBar = useMemo(
    () => (
      <div className="flex p-2 pt-0">
        <SearchField
          aria-label="Suchen"
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
      <DataTable columns={columns} data={contacts.data} footer={footer} filterBar={filterBar} />
    </PageContainer>
  )
}

export default ContactIndex
