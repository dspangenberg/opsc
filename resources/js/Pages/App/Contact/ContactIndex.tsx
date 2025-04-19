import { useCallback, useMemo } from 'react'
import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import {
  FolderViewIcon,
  FolderManagementIcon,
  Add01Icon,
  InboxIcon,
  FilterIcon,
  MoreVerticalCircle01Icon,
  Sorting05Icon
} from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { DataTable } from '@/Components/DataTable'
import { EmptyState } from '@/Components/EmptyState'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { columns } from './ContactIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { HugeiconsIcon } from '@hugeicons/react'
import { useId } from 'react'
import { ContactIndexFilterPopover } from './ContactIndexFilterPopover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'
import { Badge } from '@/Components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { ContactIndexFolders } from '@/Pages/App/Contact/ContactIndexFolders'
interface ContactIndexProps extends PageProps {
  contacts: App.Data.Paginated.Contact & App.Data.Paginated.PaginationMeta<App.Data.ContactData[]>
}

const ContactIndex: React.FC = () => {
  const { contacts } = usePage<ContactIndexProps>().props
  const id = useId()

  const { visitModal } = useModalStack()

  const handleAdd = useCallback(() => {
    visitModal(route('app.accommodation.create'))
  }, [visitModal])

  const breadcrumbs = useMemo(() => [{ title: 'Kontakte', route: route('app.contact.index') }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={Add01Icon} title="Kontakt hinzufügen" />
        <ToolbarButton icon={MoreVerticalCircle01Icon} />
      </Toolbar>
    ),
    []
  )

  const tabs = useMemo(
    () => (
      <NavTabs>
        <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts">
          Alle Kontakte (unarchiviert)
        </NavTabsTab>
        <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
          Favoriten
        </NavTabsTab>
        <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
          <HugeiconsIcon icon={Add01Icon} /> View
        </NavTabsTab>
      </NavTabs>
    ),
    []
  )

  const footer = useMemo(() => <Pagination data={contacts} itemName="Kontakte" />, [contacts])
  const header = useMemo(
    () => (
      <div className="flex flex-col py-0 rounded-t-md w-7xl">
        <div className="flex-none space-x-2 pb-2 flex items-center">
          <ContactIndexFilterPopover />
          <Button variant="ghost" icon={Sorting05Icon}>
            Sortierung
          </Button>
        </div>
      </div>
    ),
    [contacts]
  )

  return (
    <PageContainer
      title="Kontakte"
      width="9xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex gap-2"
      toolbar={toolbar}
    >
      <ContactIndexFolders />
      <div className="flex-1 mx-4">
        {contacts.data.length > 0 ? (
          <DataTable columns={columns} data={contacts.data} footer={footer} header={header} />
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
      </div>
    </PageContainer>
  )
}

export default ContactIndex
