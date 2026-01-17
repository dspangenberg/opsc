import {
  Archive03Icon,
  ArchiveOff03Icon,
  Delete02Icon,
  Edit03Icon,
  MoreVerticalCircle01Icon,
  UserAdd02Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Avatar } from '@/Components/twc-ui/avatar'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Tab, TabList, Tabs } from '@/Components/twc-ui/tabs'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'

interface Props {
  contact: App.Data.ContactData
  children: React.ReactNode
}

export const ContactDetailsLayout: React.FC<Props> = ({ contact, children }) => {
  const breadcrumbs = useMemo(
    () => [{ title: 'Kontakte', url: route('app.contact.index') }, { title: contact.full_name }],
    [contact.full_name]
  )

  const currentRoute = route().current()
  const handleArchive = () => router.put(route('app.contact.archive', { contact: contact.id }), {})
  const handleDelete = async () => {
    console.log(contact.id)
    const promise = await AlertDialog.call({
      title: 'Kontakt löschen',
      message: 'Möchtest Du die Kontakt wirklich löschen?',
      buttonTitle: 'Kontakt löschen'
    })
    if (promise) {
      router.delete(route('app.contact.delete', { contact: contact.id }))
    }
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        {currentRoute === 'app.contact.details' && (
          <>
            <Button
              variant="toolbar-default"
              icon={Edit03Icon}
              title="Bearbeiten"
              onClick={() => router.visit(route('app.contact.edit', { contact: contact.id }))}
            />
            <DropdownButton variant="ghost" icon={MoreVerticalCircle01Icon}>
              <MenuItem
                icon={Edit03Icon}
                title="Bearbeiten"
                onClick={() => router.visit(route('app.contact.edit', { contact: contact.id }))}
              />
              {contact.is_archived ? (
                <MenuItem
                  icon={ArchiveOff03Icon}
                  title="Kontakt wiederherstellen"
                  onAction={handleArchive}
                  separator
                />
              ) : (
                <MenuItem
                  icon={Archive03Icon}
                  title="Kontakt archivieren"
                  onAction={handleArchive}
                  separator
                />
              )}
              <MenuItem
                icon={Delete02Icon}
                variant="destructive"
                title="Kontakt löschen"
                onClick={handleDelete}
              />
            </DropdownButton>
          </>
        )}

        {currentRoute === 'app.contact.details.persons' && (
          <Button
            variant="toolbar-default"
            icon={UserAdd02Icon}
            title="Ansprechperson hinzufügen"
            onClick={() =>
              router.visit(route('app.contact.create-person', { company: contact.id }))
            }
          />
        )}
      </Toolbar>
    ),
    [currentRoute, contact.id, contact.is_archived]
  )

  const tabs = useMemo(
    () => (
      <Tabs variant="underlined" defaultSelectedKey={currentRoute}>
        <TabList aria-label="Tabs">
          <Tab id="app.contact.details" href={route('app.contact.details', { contact }, false)}>
            Übersicht
          </Tab>

          {contact.is_org && (
            <Tab
              id="app.contact.details.persons"
              href={route('app.contact.details.persons', { contact: contact.id })}
              className="flex items-center gap-1"
            >
              Ansprechpersonen
              {contact.contacts && contact.contacts.length > 0 && (
                <Badge variant="secondary" className="border border-border">
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
    () => route('app.contact.details', { contact: contact.company_id }),
    [contact.company_id]
  )

  const headerContent = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <div className="flex-none">
          <Avatar
            initials={contact.initials}
            fullname={contact.full_name}
            src={contact.avatar_url}
            size="lg"
          />
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
      contact.short_name,
      contact.avatar_url
    ]
  )

  return (
    <PageContainer
      title={contact.full_name}
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex gap-4 overflow-y-auto"
      toolbar={toolbar}
      tabs={tabs}
      header={headerContent}
    >
      {children}
    </PageContainer>
  )
}
