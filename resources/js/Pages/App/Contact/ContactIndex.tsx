/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { EmptyState } from '@/Components/EmptyState'
import { Toolbar, ToolbarButton } from '@/Components/Toolbar'
import { useBreadcrumbProvider } from '@/Components/breadcrumb-provider'

import { Add01Icon, InboxIcon } from '@hugeicons-pro/core-stroke-rounded'
import { usePage } from '@inertiajs/react'

import { DataTable } from '@/Components/DataTable'
import { useModalStack } from '@inertiaui/modal-react'
import type React from 'react'
import { useEffect } from 'react'
import { columns } from './ContactIndexColumns'
import { PageContainer } from '@/Components/PageContainer'

const ContactIndex: React.FC = () => {
  const contacts = usePage().props.contacts as App.Data.ContactData[]

  const { visitModal } = useModalStack()
  const { setBreadcrumbs } = useBreadcrumbProvider()
  const handleAdd = () => {
    visitModal(route('app.accommodation.create'))
  }

  useEffect(() => {
    setBreadcrumbs([{ title: 'Kontakte', route: route('app.contact.index') }])
  }, [])

  return (
    <PageContainer
      title="Kontakte"
      width="7xl"
      header={
        <Toolbar title="Kontakte" className="flex-none">
          <ToolbarButton
            variant="primary"
            label="Kontakt hinzufügen"
            icon={Add01Icon}
            onClick={handleAdd}
          />
        </Toolbar>
      }
    >
      <div className="flex-1 rounded-lg border-stone-100 px-4 flex flex-col">
        {contacts.length > 0 ? (
          <DataTable columns={columns} data={contacts} />
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
