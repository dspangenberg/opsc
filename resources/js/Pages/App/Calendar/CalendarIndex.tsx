/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Button } from '@/Components/ui/button'
import {
  Edit02Icon
} from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon} from '@hugeicons/react'
import { usePage } from '@inertiajs/react'
import type React from 'react'
const CalendarIndex: React.FC = () => {
  const calendar = usePage().props.calendar as App.Data.CalendarData

  return <div className="h-full rounded-lg border-stone-100 px-4 flex flex-col">
    {calendar.name}
    <Button variant="outline" size="default">
      <HugeiconsIcon icon={Edit02Icon} className="size-4"/>
      Kalender bearbeiten
    </Button>
  </div>
}

export default CalendarIndex
