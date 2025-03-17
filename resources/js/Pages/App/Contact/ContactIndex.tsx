import { useCallback, useMemo } from 'react'
import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import { NoteEditIcon, PrinterIcon, Add01Icon, InboxIcon } from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { DataTable } from '@/Components/DataTable'
import { EmptyState } from '@/Components/EmptyState'
import { PageContainer } from '@/Components/PageContainer'
import { Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { columns } from './ContactIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'

interface ContactIndexProps extends PageProps {
  contacts: App.Data.Paginated.Contact & App.Data.Paginated.PaginationMeta<App.Data.ContactData[]>
}

const ContactIndex: React.FC = () => {
  const { contacts } = usePage<ContactIndexProps>().props

  const { visitModal } = useModalStack()

  const handleAdd = useCallback(() => {
    visitModal(route('app.accommodation.create'))
  }, [visitModal])

  const breadcrumbs = useMemo(() => [{ title: 'Kontakte', route: route('app.contact.index') }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={NoteEditIcon} title="Bearbeiten" />
        <ToolbarButton icon={PrinterIcon} title="Drucken" />
      </Toolbar>
    ),
    []
  )

  const tabs = useMemo(
    () => (
      <NavTabs>
        <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts">
          Alle Kontakte
        </NavTabsTab>
        <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
          Favoriten
        </NavTabsTab>
      </NavTabs>
    ),
    []
  )

  const footer = useMemo(() => <Pagination data={contacts} />, [contacts])

  return (
    <PageContainer
      title="Kontakte"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex"
      toolbar={toolbar}
      tabs={tabs}
    >
      {contacts.data.length > 0 ? (
        <DataTable columns={columns} data={contacts.data} footer={footer} />
      ) : (
        <EmptyState
          buttonLabel="Ersten Kontakt hinzufügen"
          buttonIcon={Add01Icon}
          onClick={handleAdd}
          icon={InboxIcon}
        >
          Ups, Du hast noch keine Kontakte.
        </EmptyState>
      )}
    </PageContainer>
  )
}

export default ContactIndex