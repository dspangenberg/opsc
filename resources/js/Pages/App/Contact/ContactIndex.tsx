import type * as React from 'react'
import { useCallback, useId, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { Add01Icon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import { DataTable } from '@/Components/DataTable'
import { EmptyState } from '@/Components/EmptyState'
import { PageContainer } from '@/Components/PageContainer'
import { Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { columns } from './ContactIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { ContactIndexFilterPopover } from './ContactIndexFilterPopover'

interface ContactIndexProps extends PageProps {
  contacts: App.Data.Paginated.Contact & App.Data.Paginated.PaginationMeta<App.Data.ContactData[]>
}

const ContactIndex: React.FC = () => {
  const { contacts } = usePage<ContactIndexProps>().props
  const id = useId()


  const handleAdd = useCallback(() => {
    console.log('Add contact clicked - modal functionality temporarily disabled')
  }, [])

  const breadcrumbs = useMemo(() => [{
    title: 'Kontakte',
    route: route('app.contact.index')
  }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={Add01Icon} title="Kontakt hinzufügen" />
        <ToolbarButton icon={MoreVerticalCircle01Icon} />
      </Toolbar>
    ),
    []
  )

  const footer = useMemo(() => <Pagination data={contacts} itemName="Kontakte" />, [contacts])
  const header = useMemo(
    () => (
      <div className="flex flex-col py-0 rounded-t-md w-7xl">
        <div className="flex-none space-x-2 pb-2 flex items-center">
          <ContactIndexFilterPopover />
        </div>
      </div>
    ),
    [contacts]
  )

  return (
    <PageContainer
      title="Kontakte"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex"
      toolbar={toolbar}
    >

      {contacts.data.length > 0 ? (
        <DataTable columns={columns} data={contacts.data} footer={footer} header={header} />
      ) : (
        <EmptyState
          buttonLabel="Ersten Kontakt hinzufügen"
          buttonIcon={Add01Icon}
          onClick={handleAdd}
        >
          Ups, Du hast noch keine Kontakte.
        </EmptyState>
      )}

    </PageContainer>
  )
}

export default ContactIndex
