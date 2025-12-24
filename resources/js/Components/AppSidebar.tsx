/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

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
import logo from '@/Assets/Images/tw.svg'
import { NavMain } from '@/Components/nav-main'
import { NavSecondary } from '@/Components/nav-secondary'
import { Sidebar, SidebarContent, SidebarHeader } from '@/Components/ui/sidebar'

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
      url: route('app.contact.index', { view: 'all' }, false),
      icon: ContactBookIcon,
      activePath: '/app/contacts',
      tooltip: 'Kontakte',
      items: [
        {
          title: 'Alle',
          url: route('app.contact.index', { view: 'all' }, false),
          activePath: '/app/contacts?view=all'
        },
        {
          title: 'Favoriten',
          url: route('app.contact.index', { view: 'favorites' }, false),
          activePath: '/app/contacts?view=favorites'
        },
        {
          title: 'Debitoren',
          url: route('app.contact.index', { view: 'debtors' }, false),
          activePath: '/app/contacts?view=debtors'
        },
        {
          title: 'Kreditoren',
          url: route('app.contact.index', { view: 'creditors' }, false),
          activePath: '/app/contacts?view=creditors'
        },
        {
          title: 'Archiviert',
          url: route('app.contact.index', { view: 'archived' }, false),
          activePath: '/app/contacts?view=archived'
        }
      ]
    },
    {
      title: 'Dokumente',
      url: route('app.documents.documents.index', {}, false),
      icon: FolderFileStorageIcon,
      activePath: '/app/documents',
      items: [
        {
          title: 'Dokumente',
          url: route('app.documents.documents.index', {}, false),
          activePath: '/app/documents/documents'
        },
        {
          title: 'Upload',
          url: route('app.documents.documents.upload-form', {}, false),
          activePath: '/app/documents/upload'
        },
        {
          title: 'Vorgaben',
          url: route('app.documents.document_types.index', {}, false),
          activePath: '/app/documents/preferences',
          items: [
            {
              title: 'Dokumenttypen',
              url: route('app.documents.document_types.index', {}, false),
              activePath: '/app/documents/preferences/document-types'
            }
          ]
        }
      ]
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
      url: route('app.time.my-week', { _query: { view: 'my-week' } }, false),
      icon: TimeScheduleIcon,
      activePath: '/app/times',
      hasSep: false,
      items: [
        {
          title: 'Meine Woche',
          url: route('app.time.my-week', { _query: { view: 'my-week' } }, false),
          activePath: '/app/times/my-week?view=my-week'
        },
        {
          title: 'Alle Zeiten',
          url: route('app.time.index', {}, false),
          activePath: '/app/times/all'
        },
        {
          title: 'Abrechnung',
          url: route('app.time.billable', {}, false),
          activePath: '/app/times/billable'
        }
      ]
    },
    {
      title: 'Fakturierung',
      url: route('app.invoice.index', { _query: { view: 'all' } }, false),
      icon: FileEuroIcon,
      activePath: '/app/invoicing/invoices',
      hasSep: true,
      items: [
        {
          title: 'Rechnungen',
          url: route('app.invoice.index', { _query: { view: 'all' } }, false),
          activePath: '/app/invoicing/invoices',
          items: [
            {
              title: 'Alle Rechnungen',
              url: route('app.invoice.index', { _query: { view: 'all' } }, false),
              activePath: '/app/invoicing/invoices?view=all'
            },
            {
              title: 'Offene Posten',
              url: route('app.invoice.index', { _query: { view: 'unpaid' } }, false),
              activePath: '/app/invoicing/invoices?view=unpaid'
            },
            {
              title: 'Entwürfe',
              url: route('app.invoice.index', { _query: { view: 'drafts' } }, false),
              activePath: '/app/invoicing/invoices?view=drafts'
            }
          ]
        },
        {
          title: 'Angebote',
          url: route('app.invoice.index', {}, false)
        }
      ]
    },
    {
      title: 'Buchhaltung',
      url: route('app.bookkeeping.bookings.index', {}, false),
      icon: AbacusIcon,
      activePath: '/app/bookkeeping',
      items: [
        {
          title: 'Buchungen',
          url: route('app.bookkeeping.bookings.index', {}, false),
          activePath: '/app/bookkeeping/bookings'
        },
        {
          title: 'Transaktionen',
          url: route('app.bookkeeping.transactions.index', {}, false),
          activePath: '/app/bookkeeping/transactions'
        },
        {
          title: 'Belege',
          url: route('app.bookkeeping.receipts.index', {}, false),
          activePath: '/app/bookkeeping/receipts',
          items: [
            {
              title: 'Upload',
              url: route('app.bookkeeping.receipts.upload-form', {}, false),
              activePath: '/app/bookkeeping/receipts/upload'
            },
            {
              title: 'Belege bestätigen',
              url: route('app.bookkeeping.receipts.confirm-first', {}, false),
              activePath: '/app/bookkeeping/receipts/confirm'
            }
          ]
        },
        {
          title: 'Vorgaben',
          url: route('app.bookkeeping.cost-centers.index', {}, false),
          activePath: '/app/bookkeeping/preferences',
          items: [
            {
              title: 'Buchhaltungskonten',
              url: route('app.bookkeeping.accounts.index', {}, false),
              activePath: '/app/bookkeeping/preferences/accounts'
            },
            {
              title: 'Kostenstellen',
              url: route('app.bookkeeping.cost-centers.index', {}, false),
              activePath: '/app/bookkeeping/preferences/cost-centers'
            },
            {
              title: 'Regeln',
              url: route('app.bookkeeping.rules.index', {}, false),
              activePath: '/app/bookkeeping/preferences/rules'
            }
          ]
        }
      ]
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
