/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import logo from '@/Assets/Images/tw.svg' // Make sure to adjust the import path
import { NavMain } from '@/Components/nav-main'
import { NavSecondary } from '@/Components/nav-secondary'
import { settings } from '@/Pages/App/Settings/SettingsLayout'
import {
  Calendar02Icon,
  DashboardCircleEditIcon,
  DashboardSpeed02Icon,
  Image03Icon,
  Settings02Icon,
  Ticket01Icon
  } from '@hugeicons-pro/core-stroke-rounded'
import type * as React from 'react'

import { CalendarSwitcher } from '@/Components/CalendardSwitcher'
import { NavGlobalTop } from '@/Components/NavGlobalTop'
import { Sidebar, SidebarContent, SidebarHeader } from '@/Components/ui/sidebar'

const data = {
  navGlobalTop: [
    {
      title: 'Dashboard',
      url: route('app.dashboard', {}, false),
      icon: DashboardSpeed02Icon,
      activePath: '/app',
      exact: true,
      hasSep: true
    }
  ],
  navMain: [
    {
      title: 'Veranstaltungen',
      hasSep: false,
      url: '#',
      icon: Calendar02Icon
    }
  ],
  navSecondary: [
    {
      title: 'Medien',
      hasSep: false,
      url: '#',
      icon: Image03Icon
    },
    {
      title: 'Ticketshop',
      url: '#',
      icon: Ticket01Icon,
      items: [
        {
          title: 'General',
          url: '#'
        },
        {
          title: 'Team',
          url: '#'
        },
        {
          title: 'Billing',
          url: '#'
        },
        {
          title: 'Limits',
          url: '#'
        }
      ]
    },
    {
      title: 'Einbindung + Widgets',
      hasSep: false,
      url: '#',
      icon: DashboardCircleEditIcon
    },
    {
      title: 'Einstellungen',
      icon: Settings02Icon,
      hasSep: true,
      activePath: '/app/settings',
      url: route('app.settings.booking.seasons'),
      items: settings
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader className="flex-none h-auto">
        <img src={logo} className="rounded-md w-10 mx-auto mt-6 mb-6 object-cover" alt="Logo" />
      </SidebarHeader>
      <SidebarContent>
        <NavGlobalTop items={data.navGlobalTop} />
      </SidebarContent>
      <SidebarHeader className="flex-none h-auto">
        <CalendarSwitcher />
      </SidebarHeader>
      <SidebarContent className="flex-1 -mt-3">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
