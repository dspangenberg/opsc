/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Delete03Icon,
  Edit03Icon,
  FileEuroIcon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import { Link, router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Avatar } from '@/Components/ui/twc-ui/avatar'
import { Icon } from '@/Components/ui/twc-ui/icon'
import {
  minutesToHoursExtended,
  minutesUntilNow,
  parseAndFormatDate,
  parseAndFormatDateTime
} from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'
import type { BillableProjects } from '@/Pages/App/Time/TimeIndex'

const editUrl = (row: App.Data.TimeData) => {
  if (!row.id) return '#'

  const currentView = route().queryParams.view
  const baseUrl = `${route('app.time.edit', { id: row.id, _query: { view: currentView } })}?view=${currentView}`
  return baseUrl
}

const billUrl = (row: BillableProjects) => {
  if (!row.id) return '#'

  const baseUrl = `${route('app.time.bill', { _query: { project_id: row.id } })}`
  return baseUrl
}

const durationInMinutes = (row: BillableProjects) => {
  console.log('durationInMinutes', row.total_mins)
  const value = minutesToHoursExtended(row.total_mins as number)
  try {
    return value
  } catch (error) {
    return 0
  }
}

const handleDeleteClicked = async (row: BillableProjects) => {
  const promise = await AlertDialog.call({
    title: 'Löschen bestätigen',
    message: 'Möchtest Du den Eintrag wirklich löschen?',
    buttonTitle: 'Eintrag löschen',
    variant: 'destructive'
  })
  if (promise) {
    router.delete(route('app.times.delete', { id: row.id }))
  }
}

const RowActions = ({ row }: { row: Row<App.Data.BillableProjects> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <MenuItem
          icon={FileEuroIcon}
          title="Projekt komplett abrechnen"
          ellipsis
          separator
          href={billUrl(row.original)}
        />
      </DropdownButton>
    </div>
  )
}

// Live Duration Cell Component mit intelligentem Blink-Effekt
const DurationCell = ({ row }: { row: Row<App.Data.BillableProjects> }) => {
  const [duration, setDuration] = useState(() => durationInMinutes(row.original))
  const [isBlinking, setIsBlinking] = useState(false)
  const isRunning = !row.original.end_at

  useEffect(() => {
    // Nur für laufende Einträge (ohne end_at) einen Timer setzen
    if (isRunning) {
      const interval = setInterval(() => {
        const newDuration = durationInMinutes(row.original)

        // Nur blinken, wenn sich der Wert tatsächlich geändert hat
        if (newDuration !== duration) {
          setIsBlinking(true)
          setDuration(newDuration)

          // Blinken nach 300ms stoppen
          setTimeout(() => setIsBlinking(false), 300)
        }
      }, 60000) // Update alle 30 Sekunden

      return () => clearInterval(interval)
    }
  }, [row.original, isRunning, duration])

  return (
    <div
      className={cn(
        'text-right transition-all duration-300',
        // Blink-Effekt nur bei tatsächlicher Änderung
        isBlinking && 'animate-pulse rounded bg-green-100 px-1 shadow-sm dark:bg-green-900/30',
        // Permanent subtiler Glow-Effekt für laufende Einträge
        isRunning && 'relative font-medium text-blue-600 dark:text-blue-400',
        isRunning &&
          "before:-inset-1 before:absolute before:animate-pulse before:rounded before:bg-blue-500/10 before:content-['']"
      )}
    >
      {duration}
      {isRunning && (
        <span
          className="ml-1 inline-block size-2 animate-pulse rounded-full bg-green-500"
          title="Läuft gerade..."
        />
      )}
    </div>
  )
}

export const columns: ColumnDef<App.Data.BillableProjects>[] = [
  {
    id: 'select',
    size: 20,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        className="mx-3 bg-background align-middle"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          className="mx-3 bg-background align-middle"
          aria-label="Select row"
        />
      </div>
    )
  },

  {
    accessorKey: 'name',
    header: 'Projekt',
    size: 200,
    cell: ({ row, getValue }) => (
      <Link
        className="truncate align-middle font-medium hover:underline"
        href={editUrl(row.original)}
      >
        {getValue() as string}
      </Link>
    )
  },
  {
    accessorKey: 'first_entry_at',
    header: 'Ältester Eintrag',
    size: 80,
    cell: ({ row, getValue }) => <span>{parseAndFormatDateTime(getValue())}</span>
  },
  {
    accessorKey: 'last_entry_at',
    header: 'Jüngster Eintrag',
    size: 80,
    cell: ({ row, getValue }) => <span>{parseAndFormatDateTime(getValue())}</span>
  },
  {
    accessorKey: 'total_mins',
    header: 'abrechenbar',
    size: 30,
    cell: ({ row }) => <div className="text-right">{durationInMinutes(row.original)} h</div>
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
