/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import logo from '@/Assets/Images/tw.svg' // Make sure to adjust the import path
import { NavMain } from '@/Components/nav-main'
import { NavSecondary } from '@/Components/nav-secondary'
import { Sidebar, SidebarContent, SidebarHeader } from '@/Components/ui/sidebar'

import {
  AbacusIcon,
  ContactBookIcon,
  DashboardSpeed02Icon,
  FileEuroIcon,
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
      url: route('app.time.my-week', {}, false),
      icon: TimeScheduleIcon,
      activePath: '/app/times',
      hasSep: false,
      items: [
        {
          title: 'Meine Woche',
          url: route('app.time.my-week', {}, false),
          activePath: '/app/times/my-week'
        },
        {
          title: 'Alle Zeiten',
          url: route('app.time.index', {}, false),
          activePath: '/app/times/all'
        }
      ]
    },
    {
      title: 'Fakturierung',
      url: route('app.invoice.index', {}, false),
      icon: FileEuroIcon,
      activePath: '/app/invoicing',
      hasSep: true,
      items: [
        {
          title: 'Rechnungen',
          url: route('app.invoice.index', {}, false),
          activePath: '/app/invoicing/invoices'
        },
        {
          title: 'Offene Posten',
          url: route('app.invoice.index', {}, false),
          activePath: '/app/invoicing/invoices'
        },
        {
          title: 'Angebote',
          url: route('app.invoice.index', {}, false)
        }
      ]
    },
    {
      title: 'Buchhaltung',
      url: route('app.invoice.index', {}, false),
      icon: AbacusIcon,
      activePath: '/app/bookkeeping',
      items: [
        {
          title: 'Transaktionen',
          url: route('app.invoice.index', {}, false)
        },
        {
          title: 'Belege',
          url: route('app.invoice.index', {}, false)
        },
        {
          title: 'Buchungen',
          url: route('app.invoice.index', {}, false)
        }
      ],
      hasSep: true
    }
  ],
  navSecondary: []
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader className="h-auto flex-none">
        <img src={logo} className="mx-auto mt-6 mb-6 w-10 rounded-md object-cover" alt="Logo" />
      </SidebarHeader>
      <SidebarContent className="-mt-3 flex-1">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
