/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { EmptyState } from '@/Components/EmptyState'
import { Toolbar, ToolbarButton } from '@/Components/Toolbar'

import { SettingsTabs } from '@/Pages/App/Settings/SettingsTabs'
import { Add01Icon, FilterIcon } from '@hugeicons-pro/core-stroke-rounded'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import type React from 'react'
import SettingsLayout from '../../SettingsLayout'



const BookingPolicyIndex: React.FC = () => {
  const policies = usePage().props.policy as App.Data.BookingPolicyData[]
  const { visitModal } = useModalStack()

  const handleAdd = () => {
    visitModal(route('app.settings.booking.policies.create'))
  }

  return (
    <SettingsLayout>
      <div className="h-full rounded-lg border-stone-100 px-4 flex flex-col">
        <Toolbar
          title="Buchungsrichtlinien"
          className="flex-none"
          tabs={
            <SettingsTabs url={'/app/settings/booking'} />
          }
        >
          <ToolbarButton
            variant="primary"
            label="Buchungsrichtlinie hinzufügen"
            icon={Add01Icon}
            onClick={handleAdd}
          />
          <ToolbarButton disabled variant="default" label="Filtern" icon={FilterIcon} />
        </Toolbar>
        <div className="flex-none flex">
          <div className="py-6 w-full justify-center space-y-6 items-center text-center rounded-lg text-sm text-muted-foreground">
            <EmptyState buttonLabel="Erste Buchungsrichtlinie hinzufügen" onClick={handleAdd}>
              Ups, Du hast noch keine Buchungsrichtlinien
            </EmptyState>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}

export default BookingPolicyIndex
