import { Add01Icon, MoreVerticalCircle01Icon, PrinterIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { JollySearchField } from '@/Components/jolly-ui/search-field'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
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
    router.visit(route('app.contact.create'))
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
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} title="Weitere Optionen">
          <MenuItem icon={Add01Icon} title="Rechnung hinzufügen" ellipsis separator />
          <MenuItem icon={PrinterIcon} title="Auswertung drucken" ellipsis />
        </DropdownButton>
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
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout
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
          only: ['contacts'],
          onSuccess: () => {
            // Update wird durch die props vom Controller gemacht
          }
        }
      )
    }, 500) // 500ms Debounce
  }, [])

  const filterBar = useMemo(
    () => (
      <div className="flex p-2 pt-0">
        <JollySearchField
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
      <DataTable
        columns={columns}
        data={contacts.data}
        footer={footer}
        filterBar={filterBar}
      />
    </PageContainer>
  )
}

export default ContactIndex
