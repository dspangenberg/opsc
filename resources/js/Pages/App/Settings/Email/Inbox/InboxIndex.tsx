/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { EmptyState } from '@/Components/EmptyState'
import { Toolbar, ToolbarButton } from '@/Components/Toolbar'

import {
  Add01Icon,
  InboxIcon
} from '@hugeicons-pro/core-stroke-rounded'
import { usePage } from '@inertiajs/react'

import { DataTable } from '@/Components/DataTable'
import { SettingsTabs } from '@/Pages/App/Settings/SettingsTabs'
import { useModalStack } from '@inertiaui/modal-react'
import type React from 'react'
import SettingsLayout from '../../SettingsLayout'
import { columns } from './InboxIndexColumns'


const InboxIndex: React.FC = () => {
  const inboxes = usePage().props.inboxes as App.Data.InboxData[]

  const { visitModal } = useModalStack()

  const handleAdd = () => {
    visitModal(route('app.settings.email.inboxes.create'))
  }


  return (
    <SettingsLayout>
      <div className="h-full rounded-lg border-stone-100 px-4 flex flex-col">
        <Toolbar
          title="Inboxen"
          className="flex-none"
          tabs={
            <SettingsTabs url={'/app/settings/email'} />
          }
        >
          <ToolbarButton
            variant="primary"
            label="Inbox hinzufügen"
            icon={Add01Icon}
            onClick={handleAdd}
          />
        </Toolbar>
        <div className="flex-none flex">

          <div className="py-6 w-full justify-center space-y-6 items-center text-center rounded-lg text-sm text-muted-foreground">
            {inboxes.length > 0 ? (
              <DataTable columns={columns} data={inboxes} />
            ) : (
              <EmptyState
                buttonLabel="Inbox hinzufügen"
                buttonIcon={Add01Icon}
                onClick={handleAdd}
                icon={InboxIcon}
              >
                Ups, Du hast noch keine Inbox.
              </EmptyState>
            )}
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}

export default InboxIndex
