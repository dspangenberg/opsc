import { Edit03Icon } from '@hugeicons/core-free-icons'
import { Link } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Badge } from '@/Components/ui/badge'
import { Avatar } from '@/Components/ui/twc-ui/avatar'
import { Button } from '@/Components/ui/twc-ui/button'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'

interface Props {
  contact: App.Data.ContactData
  children: React.ReactNode
}

export const ContactDetailsLayout: React.FC<Props> = ({ contact, children }) => {
  const breadcrumbs = useMemo(
    () => [
      { title: 'Kontakte', url: route('app.contact.index') },
      { title: contact.full_name, url: route('app.contact.details', { id: contact.id }) }
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
      <Tabs variant="underlined" defaultSelectedKey={currentRoute}>
        <TabList aria-label="Ansicht">
          {/** biome-ignore lint/correctness/useUniqueElementIds: <explanation>ID kommt von Route</explanation> */}
          <Tab id="app.invoice.details" href={route('app.contact.details', { contact }, false)}>
            Übersicht
          </Tab>

          {contact.is_org && (
            // biome-ignore lint/correctness/useUniqueElementIds: <explanation>Routepath ist die ID</explanation>
            <Tab
              id="app.contact.details.persons"
              href={route('app.contact.details.persons', { id: contact.id })}
              className="flex items-center gap-1"
            >
              Ansprechpersonen
              {contact.contacts && contact.contacts.length > 0 && (
                <Badge variant="secondary" className="h-fit border border-border">
                  {contact.contacts.length}
                </Badge>
              )}
            </Tab>
          )}
        </TabList>
      </Tabs>
    ),
    [currentRoute, contact]
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
        <div className="flex flex-1 flex-col">
          <div className="max-w-lg flex-1 truncate font-bold text-xl">
            {contact.short_name || contact.full_name}
          </div>
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
    [
      contact.initials,
      contact.full_name,
      contact.company_id,
      contact.company?.name,
      companyRoute,
      contact.short_name
    ]
  )

  return (
    <PageContainer
      title={contact.full_name}
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex gap-4 overflow-hidden"
      toolbar={toolbar}
      tabs={tabs}
      header={headerContent}
    >
      {children}
    </PageContainer>
  )
}
