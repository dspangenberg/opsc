import { useMemo } from 'react'
import type * as React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import { NoteEditIcon, PrinterIcon } from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { PageContainer } from '@/Components/PageContainer'
import { Avatar, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import type { PageProps } from '@/Types'
import { ContactDetailsOrg } from '@/Pages/App/Contact/ContactDetailsOrg'
import { ContactDetailsPerson } from '@/Pages/App/Contact/ContactDetailsPerson'

interface ContactIndexProps extends PageProps {
  contact: App.Data.ContactData
}

const ContactDetails: React.FC = () => {
  const { contact } = usePage<ContactIndexProps>().props
  const { visitModal } = useModalStack()

  const breadcrumbs = useMemo(() => [
    { title: 'Kontakte', route: route('app.contact.index') },
    { title: contact.full_name, route: route('app.contact.details', { id: contact.id }) }
  ], [contact.full_name, contact.id])

  const toolbar = useMemo(() => (
    <Toolbar className="bg-background border-0 shadow-none">
      <ToolbarButton variant="default" icon={NoteEditIcon} title="Bearbeiten" />
      <ToolbarButton icon={PrinterIcon} />
    </Toolbar>
  ), [])

  const tabs = useMemo(() => (
    <NavTabs>
      <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts">
        Übersicht
      </NavTabsTab>
      <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
        Kontakte
      </NavTabsTab>
    </NavTabs>
  ), [])

  const companyRoute = useMemo(() => 
    route('app.contact.details', { id: contact.company_id }),
    [contact.company_id]
  )

  const headerContent = useMemo(() => (
    <div className="flex items-center gap-2">
      <div className="flex-none">
        <Avatar initials={contact.initials} fullname={contact.full_name} className="size-10" />
      </div>
      <div className="flex-1">
        <div className="flex-1 text-2xl font-bold">{contact.full_name}</div>
        {contact.company_id && (
          <div className="text-base text-foreground">
            <Link href={companyRoute} className="hover:underline">
              {contact.company?.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  ), [contact.initials, contact.full_name, contact.company_id, contact.company?.name, companyRoute])

  return (
    <PageContainer
      title={contact.full_name}
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex gap-4"
      toolbar={toolbar}
      tabs={tabs}
      header={headerContent}
    >
      <>
        <div className="flex-1">xxx</div>
        <div className="w-sm flex-none h-fit space-y-6">
          {contact.company_id && <ContactDetailsPerson contact={contact} />}
          <ContactDetailsOrg
            contact={contact.company || contact}
            showSecondary={!contact.company_id}
          />
        </div>
      </>
    </PageContainer>
  )
}

export default ContactDetails
