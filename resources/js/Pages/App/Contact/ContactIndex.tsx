import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { Add01Icon, MoreVerticalCircle01Icon, PrinterIcon } from '@hugeicons/core-free-icons'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback, useId, useMemo } from 'react'
import { columns } from './ContactIndexColumns'
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
        <Button variant="toolbar-default" icon={Add01Icon} title="Kontakt hinzufügen" />
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} title="Weitere Optionen">
          <MenuItem icon={Add01Icon} title="Rechnung hinzufügen" ellipsis separator />
          <MenuItem icon={PrinterIcon} title="Auswertung drucken" ellipsis />
        </DropdownButton>
      </Toolbar>
    ),
    []
  )

  const footer = useMemo(() => <Pagination data={contacts} itemName="Kontakte" />, [contacts])
  const header = useMemo(
    () => (
      <div className="flex w-7xl flex-col rounded-t-md py-0">
        <div className="flex flex-none items-center space-x-2 pb-2">
          <ContactIndexFilterPopover />
        </div>
      </div>
    ),
    []
  )

  return (
    <PageContainer
      title="Kontakte"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable columns={columns} data={contacts.data} footer={footer} header={header} />
    </PageContainer>
  )
}

export default ContactIndex
