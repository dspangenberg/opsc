import { useMemo } from 'react'
import type * as React from 'react'
import { Link } from '@inertiajs/react'
import { Edit03Icon, PrinterIcon } from '@hugeicons/core-free-icons'
import { PageContainer } from '@/Components/PageContainer'
import { Avatar, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { ClassicNavTabsTab } from '@/Components/ClassicNavTabs'

interface Props {
  contact: App.Data.ContactData
  children: React.ReactNode
}

export const ContactDetailsLayout: React.FC<Props> = ({ contact, children }) => {
  const breadcrumbs = useMemo(
    () => [
      { title: 'Kontakte', route: route('app.contact.index') },
      { title: contact.full_name, route: route('app.contact.details', { id: contact.id }) }
    ],
    [contact.full_name, contact.id]
  )

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={Edit03Icon} title="Bearbeiten" />
        <ToolbarButton icon={PrinterIcon} />
      </Toolbar>
    ),
    []
  )

  const tabs = useMemo(
    () => (
      <>
        <ClassicNavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts">
          Aktivität
        </ClassicNavTabsTab>
        {contact.is_org === true && (
          <ClassicNavTabsTab
            href={route('app.contact.index')}
            activeRoute="/app/contacts/favorites"
          >
            Kontakte
          </ClassicNavTabsTab>
        )}
        <ClassicNavTabsTab href={route('app.contact.index')} activeRoute="/app/contactsx">
          Projekte
        </ClassicNavTabsTab>
      </>
    ),
    [contact.is_org]
  )

  const companyRoute = useMemo(
    () => route('app.contact.details', { id: contact.company_id }),
    [contact.company_id]
  )

  const headerContent = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <Avatar initials={contact.initials} fullname={contact.full_name} size="lg" />
        </div>
        <div className="flex-1">
          <div className="flex-1 text-2xl font-bold">{contact.full_name}</div>
          {!!contact.company_id && (
            <div className="text-base text-foreground">
              <Link href={companyRoute} className="hover:underline">
                {contact.company?.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    ),
    [contact.initials, contact.full_name, contact.company_id, contact.company?.name, companyRoute]
  )

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
      {children}
    </PageContainer>
  )
}
