/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Delete03Icon,
  Edit03Icon,
  EuroIcon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import { Link, router } from '@inertiajs/react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Avatar } from '@/Components/twc-ui/avatar'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { Badge } from '@/Components/ui/badge'
import { Checkbox } from '@/Components/ui/checkbox'
import { minutesToHoursExtended, minutesUntilNow, parseAndFormatDate } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'

const editUrl = (row: App.Data.TimeData) => {
  if (!row.id) return '#'

  const currentView = route().queryParams.view
  const baseUrl = `${route('app.time.edit', { id: row.id, _query: { view: currentView } })}?view=${currentView}`
  return baseUrl
}

const durationInMinutes = (row: App.Data.TimeData) => {
  if (row.end_at) {
    return minutesToHoursExtended(row.mins as number)
  }
  return minutesUntilNow(row.begin_at)
}

const handleDeleteClicked = async (row: App.Data.TimeData) => {
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

const RowActions = ({ row }: { row: Row<App.Data.TimeData> }) => {
  return (
    <div className="mx-auto">
      <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
        <>
          <MenuItem
            icon={Edit03Icon}
            title="Eintrag bearbeiten"
            ellipsis
            separator
            href={editUrl(row.original)}
          />
          <MenuItem
            icon={Delete03Icon}
            variant="destructive"
            title="Eintrag löschen"
            ellipsis
            onAction={() => handleDeleteClicked(row.original)}
          />
        </>
      </DropdownButton>
    </div>
  )
}

// Live Duration Cell Component mit intelligentem Blink-Effekt
const DurationCell = ({ row }: { row: Row<App.Data.TimeData> }) => {
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
          "before:absolute before:-inset-1 before:animate-pulse before:rounded before:bg-blue-500/10 before:content-['']"
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

export const columns: ColumnDef<App.Data.TimeData>[] = [
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
    accessorKey: 'user.initials',
    header: '',
    size: 20,
    cell: ({ row }) => (
      <div className="relative flex items-center">
        <Avatar
          initials={row.original.user?.initials}
          fullname={row.original.user?.full_name}
          src={row.original.user?.avatar_url as unknown as string}
          size="md"
        />
        {row.original.is_billable && (
          <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-blue-300">
            <Icon icon={EuroIcon} className="size-3 text-blue-800" strokeWidth={2} />
          </div>
        )}
      </div>
    )
  },
  {
    accessorKey: 'date',
    header: 'Datum',
    size: 40,
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
    accessorKey: 'begin_at',
    header: 'Start',
    size: 30,
    cell: ({ row, getValue }) => <span>{parseAndFormatDate(getValue() as string, 'HH:mm')}</span>
  },
  {
    accessorKey: 'end_at',
    header: 'Ende',
    size: 30,
    cell: ({ row, getValue }) => <span>{parseAndFormatDate(getValue() as string, 'HH:mm')}</span>
  },
  {
    accessorKey: 'project_id',
    header: 'Projekt / Notizen',
    size: 300,
    cell: ({ getValue, row }) => (
      <>
        <Link href="#" className="truncate align-middle hover:underline">
          {row.original.project?.name}
        </Link>{' '}
        <Badge variant="outline" className="ml-1">
          {row.original.category?.short_name}
        </Badge>
        <div className="line-clamp-1 pt-0.5 font-xs text-foreground/60">{row.original.note}</div>
      </>
    )
  },
  {
    accessorKey: 'mins',
    header: 'Dauer',
    size: 30,
    cell: ({ row }) => <DurationCell row={row} />
  },
  {
    id: 'actions',
    size: 30,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false
  }
]
