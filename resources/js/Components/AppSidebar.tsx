/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import logo from '@/Assets/Images/tw.svg' // Make sure to adjust the import path
import { NavMain } from '@/Components/nav-main'
import { NavSecondary } from '@/Components/nav-secondary'
import { Sidebar, SidebarContent, SidebarHeader } from '@/Components/ui/sidebar'

import {
  ContactBookIcon,
  DashboardSpeed02Icon,
  FileEuroIcon,
  AbacusIcon,
  FolderFileStorageIcon,
  KanbanIcon,
  TimeScheduleIcon
} from '@hugeicons/core-free-icons'

import type * as React from 'react'

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
      url: route('app.contact.index', {}, false),
      icon: ContactBookIcon,
      activePath: '/app/contacts'
    },
    {
      title: 'Dokumente',
      url: route('app.dashboard', {}, false),
      icon: FolderFileStorageIcon,
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
      url: route('app.time.index', {}, false),
      icon: TimeScheduleIcon,
      activePath: '/app/times',
      hasSep: false
    },
    {
      title: 'Fakturierung',
      url: route('app.invoice.index', {}, false),
      icon: FileEuroIcon,
      activePath: '/app/invoicing',
      hasSep: true,
      items: [{
        title: 'Rechnungen',
        url: route('app.invoice.index', {}, false),
        activePath: '/app/invoicing/invoices',
      },
        {
          title: 'Angebote',
          url: route('app.invoice.index', {}, false),
        }
      ],
    },
    {
      title: 'Buchhaltung',
      url: route('app.invoice.index', {}, false),
      icon: AbacusIcon,
      activePath: '/app/bookkeeping',
      items: [{
        title: 'Transaktionen',
        url: route('app.invoice.index', {}, false),
      },
        {
          title: 'Belege',
          url: route('app.invoice.index', {}, false),
        }
        ,
        {
          title: 'Buchungen',
          url: route('app.invoice.index', {}, false),
        }],
      hasSep: true
    }
  ],
  navSecondary: []
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="flex-none h-auto">
        <img src={logo} className="rounded-md w-10 mx-auto mt-6 mb-6 object-cover" alt="Logo" />
      </SidebarHeader>
      <SidebarContent className="flex-1 -mt-3">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
