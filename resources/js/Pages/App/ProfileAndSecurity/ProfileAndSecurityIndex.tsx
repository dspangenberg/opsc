/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { EmptyState } from '@/Components/EmptyState'
import { Toolbar, ToolbarButton } from '@/Components/Toolbar'
import { Add01Icon, FilterIcon} from '@hugeicons-pro/core-stroke-rounded'
import type React from 'react'

const handleAdd = () => {
  console.log('Add clicked')
}

const ProfileAndSecurityIndex: React.FC = () => {

  return (

      <div className="h-full rounded-lg border-stone-100 px-4 flex flex-col">
        <Toolbar
          title="Personengruppen"
          className="flex-none"
        >
          <ToolbarButton
            variant="primary"
            label="Saison hinzufügen"
            icon={Add01Icon}
            onClick={handleAdd}
          />
          <ToolbarButton disabled variant="default" label="Filtern" icon={FilterIcon} />
        </Toolbar>
        <div className="flex-none flex">
          <div className="py-6 w-full justify-center space-y-6 items-center text-center rounded-lg text-sm text-muted-foreground">
            <EmptyState buttonLabel="Erste Saisons hinzufügen" onClick={handleAdd}>
              Ups, Du hast noch keine Personengruppen
            </EmptyState>
          </div>
        </div>
      </div>
  )
}

export default ProfileAndSecurityIndex
