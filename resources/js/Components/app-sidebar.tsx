/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import logo from '@/Assets/Images/tw.svg' // Make sure to adjust the import path
import { NavMain } from '@/Components/nav-main'
import { NavSecondary } from '@/Components/nav-secondary'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from '@/Components/ui/sidebar'
import { settings } from '@/Pages/App/Settings/SettingsLayout'
import {
  ContactBookIcon,
  ContractsIcon,
  DashboardSpeed02Icon,
  FileEuroIcon,
  FolderFileStorageIcon,
  KanbanIcon,
  Settings02Icon,
  TimeScheduleIcon
} from '@hugeicons-pro/core-stroke-rounded'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { NavUser } from './nav-user'

const data = {
  navGlobalTop: [],
  navMain: [
    {
      title: 'Dashboard',
      url: route('app.dashboard', {}, false),
      icon: DashboardSpeed02Icon,
      activePath: '/app',
      exact: true,
      hasSep: true
    },
    {
      title: 'Kontakte',
      url: route('app.dashboard', {}, false),
      icon: ContactBookIcon,
      activePath: '/appsi'
    },
    {
      title: 'Dokumente',
      url: route('app.dashboard', {}, false),
      icon: FolderFileStorageIcon,
      activePath: '/appsi'
    },
    {
      title: 'Verträge',
      url: route('app.dashboard', {}, false),
      icon: ContractsIcon,
      activePath: '/appsi'
    },
    {
      title: 'Projekte',
      url: route('app.dashboard', {}, false),
      icon: KanbanIcon,
      activePath: '/appsi',
      hasSep: true
    },
    {
      title: 'Zeiterfassung',
      url: route('app.dashboard', {}, false),
      icon: TimeScheduleIcon,
      activePath: '/appsi',
      hasSep: false
    },
    {
      title: 'Fakturierung',
      url: route('app.dashboard', {}, false),
      icon: FileEuroIcon,
      activePath: '/appsi',
      hasSep: true
    }
  ],
  navSecondary: [
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user: App.Data.UserData = usePage().props.auth.user

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="flex-none h-auto">
        <img src={logo} className="rounded-md w-10 mx-auto mt-6 mb-6 object-cover" alt="Logo" />
      </SidebarHeader>
      <SidebarContent className="flex-1 -mt-3">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
