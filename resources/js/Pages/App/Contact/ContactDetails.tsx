import { useCallback, useMemo } from 'react'
import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import { NoteEditIcon, PrinterIcon } from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { PageContainer } from '@/Components/PageContainer'
import { Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import type { PageProps } from '@/Types'
import { DataCard, DataCardSection, DataCardField, DataCardContent } from '@/Components/DataCard'

interface ContactIndexProps extends PageProps {
  contact: App.Data.ContactData
}

const ContactDetails: React.FC = () => {
  const { contact } = usePage<ContactIndexProps>().props

  const { visitModal } = useModalStack()

  const handleAdd = useCallback(() => {
    visitModal(route('app.accommodation.create'))
  }, [visitModal])

  const breadcrumbs = useMemo(
    () => [
      { title: 'Kontakte', route: route('app.contact.index') },
      { title: contact.full_name, route: route('app.contact.details', { id: contact.id }) }
    ],
    []
  )

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
          Übersicht
        </NavTabsTab>
        <NavTabsTab href={route('app.contact.index')} activeRoute="/app/contacts/favorites">
          Kontakte
        </NavTabsTab>
      </NavTabs>
    ),
    []
  )

  return (
    <PageContainer
      title={contact.full_name}
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex gap-4"
      toolbar={toolbar}
      tabs={tabs}
    >
      <>
        <div className="flex-1">xxx</div>
        <div className="w-sm flex-none h-fit">
          <DataCard title={contact.full_name}>
            <DataCardContent>
              <DataCardSection className="grid grid-cols-2" title="Stammdaten">
                <DataCardField
                  variant="vertical"
                  label="Kunden- und Debitornr."
                  value={contact.debtor_number}
                />
                <DataCardField
                  variant="vertical"
                  label="Kreditornr."
                  value={contact.creditor_number}
                />
              </DataCardSection>
              <DataCardSection title="Register- und Steuerdaten">
                <DataCardField variant="vertical" label="Register" value={contact.register_number}>
                  {contact.register_court} ({contact.register_number})
                </DataCardField>
                <DataCardField variant="vertical" label="Umsatzsteuer-ID" value={contact.vat_id} />
                <DataCardField variant="vertical" label="Steuernummer" value={contact.tax_number} />
              </DataCardSection>
            </DataCardContent>
          </DataCard>
        </div>
      </>
    </PageContainer>
  )
}

export default ContactDetails
