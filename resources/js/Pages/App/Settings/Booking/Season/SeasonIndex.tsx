/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  FilterIcon
} from '@hugeicons-pro/core-stroke-rounded'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import type React from 'react'
import { useState } from 'react'

import { EmptyState } from '@/Components/EmptyState'
import { Toolbar, ToolbarButton } from '@/Components/Toolbar'
import { Button } from '@/Components/ui/button'

import { SettingsTabs } from '@/Pages/App/Settings/SettingsTabs'
import { HugeiconsIcon } from '@hugeicons/react'
import SettingsLayout from '../../SettingsLayout'
import { columns } from './SeasonIndexColumns'
import { DataTable } from './SeasonIndexDataTable'
const SeasonIndex: React.FC = () => {
  const seasons = usePage().props.seasons as App.Data.SeasonData[]
  const { visitModal } = useModalStack()

  const handleAdd = () => {
    visitModal(route('app.settings.booking.seasons.create'))
  }

  const [year, setYear] = useState(new Date().getFullYear())

  return (
    <SettingsLayout>
      <div className="">
        <Toolbar
          title="Saisons"
          className="flex-none rounded-none shadow-none"
          tabs={
            <SettingsTabs url={'/app/settings/booking'} />
          }
        >
          <ToolbarButton
            variant="primary"
            label="Saison hinzufügen"
            icon={Add01Icon}
            onClick={handleAdd}
          />
          <ToolbarButton variant="default" label="Filtern" icon={FilterIcon} />
        </Toolbar>

        <div>
          <div className="items-center justify-between mb-6 max-w-[150px] mx-auto hidden">
            <Button variant="ghost" size="icon" onClick={() => setYear(year - 1)}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="text-primary" size={20} strokeWidth={2}  aria-label={`Zum Jahr ${year - 1} wechseln`}  />
            </Button>
            <div className="font-bold text-lg">{year}</div>
            <Button variant="ghost" size="icon" onClick={() => setYear(year + 1)}>
              <HugeiconsIcon icon={ArrowRight01Icon} className="text-primary" size={20} strokeWidth={2}  aria-label={`Zum Jahr ${year + 1} wechseln`}  />
            </Button>
          </div>
        </div>
        <div className="py-6 w-full justify-center space-y-6 items-center text-center rounded-lg text-sm text-muted-foreground">
          {seasons.length > 0 ? (
            <DataTable columns={columns} data={seasons} />
          ) : (
            <EmptyState buttonLabel="Erste Saisons hinzufügen" onClick={handleAdd}>
              Ups, Du hast noch keine Saisons
            </EmptyState>
          )}
        </div>
      </div>
    </SettingsLayout>
  )
}

export default SeasonIndex
