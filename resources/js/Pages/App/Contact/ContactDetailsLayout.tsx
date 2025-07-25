import { useMemo } from 'react'
import type * as React from 'react'
import { Link } from '@inertiajs/react'
import { Add01Icon, Edit03Icon, MoreVerticalCircle01Icon, PrinterIcon } from '@hugeicons/core-free-icons'
import { PageContainer } from '@/Components/PageContainer'
import { Avatar } from '@dspangenberg/twcui'
import { Toolbar } from '@/Components/twcui/toolbar'
import { Button } from '@/Components/ui/twc-ui/button'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'

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
      <Toolbar>
        <Button variant="toolbar-default" icon={Edit03Icon} title="Bearbeiten" />
      </Toolbar>
    ),
    []
  )
  const currentRoute = route().current()

  const tabs = useMemo(
    () => (
      <Tabs variant="underlined" defaultSelectedKey={currentRoute} tabClassName="text-base -mb-1">
        <TabList aria-label="Ansicht">
          <Tab id="app.invoice.details" href={route('app.contact.details', {contact}, false)}>Übersicht</Tab>
          <Tab id="app.invoice.history">Kontakte</Tab>
        </TabList>
      </Tabs>
    ),
    []
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
        <div className="flex-1 flex">
          <div className="flex-1 max-w-lg font-bold text-xl truncate">{contact.full_name}</div>
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
      className='flex gap-4 overflow-hidden'
      toolbar={toolbar}
      tabs={tabs}
      header={headerContent}
    >
      {children}
    </PageContainer>
  )
}
