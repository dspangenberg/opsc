/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useCalendar } from '@/Components/CalendarProvider'
import { useThemeContainer } from '@/Components/theme-container-provider'
import type { PageProps } from '@/Types'
import { useModalStack } from '@inertiaui/modal-react'
import type * as React from 'react'
import { useEffect } from 'react'

const Dashboard: React.FC<PageProps> = ({ auth }) => {
  const { setWidth } = useThemeContainer()
  const { visitModal } = useModalStack()
  const { calendar } = useCalendar()

  useEffect(() => {
    setWidth('7xl')
  }, [setWidth])

  useEffect(() => {
    if (calendar === null) {
      visitModal(route('app.calendar.create'))
    }
  }, [calendar])

  return (
    <div className="mx-auto h-full rounded-xl bg-muted/50 p-8">
      Hi, {auth.user.first_name}
      {calendar && (
        <p>Current calendar: {calendar.name}</p>
      )}
    </div>
  )
}

export default Dashboard
