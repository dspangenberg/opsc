/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

"use client"

import { useCalendar } from '@/Components/CalendarProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Icon } from '@/Components/ui/icon'
import type { IconName } from '@/Components/ui/icon-picker'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/Components/ui/sidebar"
import type { PageProps } from '@/Types'
import {
  CalendarAdd01Icon
} from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon} from '@hugeicons/react'
import { usePage } from '@inertiajs/react'
import { router } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import { ChevronsUpDown, Plus } from "lucide-react"
import * as React from "react"


export function CalendarSwitcher() {
  const { isMobile } = useSidebar()
  const { calendar, setCalendar } = useCalendar()
  const { props } = usePage<PageProps>()
  const calendars = (props as any).calendars as App.Data.CalendarData[] | undefined
  const { visitModal } = useModalStack()

  if (!calendars) {
    return null // or some fallback UI
  }

  const handleAddCalendar = () => {
    visitModal(route('app.calendar.create'))
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-6 items-center justify-center rounded-md text-white" style={{ background: calendar?.color }}>
                {calendar?.icon && <Icon name={calendar?.icon as unknown as IconName} className="size-4"  /> }
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-semibold">
                  {calendar?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Kalender
            </DropdownMenuLabel>
            {calendars.map((calendar, index) => (
              <DropdownMenuItem
                key={calendar.name}
                onClick={() => setCalendar(calendar)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md text-white" style={{ background: calendar?.color }}>
                  {calendar?.icon && <Icon name={calendar?.icon as unknown as IconName} className="size-4"  /> }
                </div>

                {calendar.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleAddCalendar}>
              <div className="flex size-6 items-center justify-center rounded-md bg-background">
                <HugeiconsIcon icon={CalendarAdd01Icon} className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Kalender hinzufügen</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
