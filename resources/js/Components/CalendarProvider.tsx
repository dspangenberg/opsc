/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { PageProps } from '@/Types'
import { router, usePage } from '@inertiajs/react'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

// type CalendarView = 'calendar' | 'list' | 'grid'

type ThemeContainerProviderProps = {
  children: React.ReactNode
  calendar: App.Data.CalendarData | null
}

type CalendarProviderState = {
  calendar: App.Data.CalendarData | null
  setCalendar: (calendar: App.Data.CalendarData | null) => void
}

const initialState: CalendarProviderState = {
  calendar: null,
  setCalendar: () => null
}

const CalendarProviderContext = createContext<CalendarProviderState>(initialState)

export function CalendarProvider({
  children,
  calendar: initialCalendar,
  ...props
}: ThemeContainerProviderProps) {
  const { calendars = [] } = usePage<PageProps>().props as PageProps & {
    calendars?: App.Data.CalendarData[]
  }
  const [calendarState, setCalendarState] = useState<App.Data.CalendarData | null>(initialCalendar)


  useEffect(() => {
    if (initialCalendar === null && calendars.length > 0) {
      const defaultCalendar = calendars.find(c => c.is_default) || calendars[0]
      setCalendarState(defaultCalendar)
    } else {
      setCalendarState(initialCalendar)
    }
  }, [initialCalendar])

  const value: CalendarProviderState = {
    calendar: calendarState,
    setCalendar: (newCalendar: App.Data.CalendarData | null) => {
      setCalendarState(newCalendar)
      if (newCalendar) {
        console.log(calendarState, newCalendar.id, 'visited'  )
        router.visit(route('app.calendar', { id: newCalendar.id }))
      }
    }
  }

  return (
    <CalendarProviderContext.Provider {...props} value={value}>
      {children}
    </CalendarProviderContext.Provider>
  )
}

export const useCalendar = () => {
  const context = useContext(CalendarProviderContext)
  if (context === undefined) throw new Error('useCalendar must be used within a CalendarProvider')
  return context
}
