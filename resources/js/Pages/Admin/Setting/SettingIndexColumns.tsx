/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Edit03Icon } from '@hugeicons/core-free-icons'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/Components/twc-ui/button'

interface ColumnOptions {
  onEditSetting?: (row: App.Data.SettingData) => void
}

export const createColumns = (options?: ColumnOptions): ColumnDef<App.Data.SettingData>[] => {
  return [
    {
      accessorKey: 'group',
      header: 'Gruppe',
      size: 100,
      cell: ({ getValue }) => (
        <div>
          <span>{getValue() as string}</span>
        </div>
      )
    },
    {
      accessorKey: 'key',
      header: 'Schlüssel',
      size: 100,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      accessorKey: 'value',
      header: 'Wert',
      size: 300,
      cell: ({ getValue }) => <span>{getValue() as string}</span>
    },
    {
      id: 'edit',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          icon={Edit03Icon}
          onClick={() => options?.onEditSetting?.(row.original)}
        />
      )
    }
  ]
}

// Für Rückwärtskompatibilität
export const columns = createColumns()
