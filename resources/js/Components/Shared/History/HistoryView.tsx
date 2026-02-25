/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { FC } from 'react'
import { parseAndFormatDate } from '@/Lib/DateHelper'
import { HistoryViewItem } from './HistoryViewItem'

interface Props {
  entries: App.Data.NoteableData[]
}

export const HistoryView: FC<Props> = ({ entries }) => {
  const entriesWithDate = entries.map(item => ({
    ...item,
    date: parseAndFormatDate(item.created_at, 'dd. MMMM yyyy')
  }))

  const groupedEntries = Object.groupBy(entriesWithDate, ({ date }) => date)
  const days = Object.keys(groupedEntries)

  const getEntriesByDate = (date: string) => groupedEntries[date] ?? []

  return (
    <div className="flex flex-1 flex-col items-start space-y-4">
      {days.map(day => (
        <>
          <div key={day} className="relative w-full flex-1">
            <div className="absolute inset-x-0 top-1/2 border-border/80 border-t" />
            <div className="relative inline-block bg-page-content pr-2 font-medium text-foreground text-sm">
              {day}
            </div>
          </div>
          <div className="flex w-full flex-col" key={`{day}-items`}>
            {getEntriesByDate(day).map((item, index) => (
              <HistoryViewItem key={item.id} item={item} />
            ))}
          </div>
        </>
      ))}
    </div>
  )
}
