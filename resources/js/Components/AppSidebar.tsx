/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  AbacusIcon,
  AccountSetting03Icon,
  ContactBookIcon,
  DashboardSpeed02Icon,
  FileEuroIcon,
  FolderFileStorageIcon,
  KanbanIcon,
  Settings05Icon,
  TimeScheduleIcon
} from '@hugeicons/core-free-icons'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import logo from '@/Assets/Images/tw.svg'
import { NavMain } from '@/Components/nav-main'
import { NavSecondary } from '@/Components/nav-secondary'
import { Sidebar, SidebarContent, SidebarHeader } from '@/Components/ui/sidebar'

const buildNavData = (isAdmin: boolean) => ({
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
      url: route(
        'app.document.index',
        { filters: { view: { operator: 'scope', value: 'all' } } },
        false
      ),
      icon: FolderFileStorageIcon,
      activePath: '/app/documents',
      items: [
        {
          title: 'Dokumente',
          url: route(
            'app.document.index',
            { filters: { view: { operator: 'scope', value: 'all' } } },
            false
          ),
          activePath: '/app/documents',
          exact: true
        },
        {
          title: 'Inbox',
          url: route(
            'app.document.index',
            { filters: { view: { operator: 'scope', value: 'inbox' } } },
            false
          ),
          activePath: '/app/documents?filters[view][value]=inbox'
        },
        {
          title: 'Papierkorb',
          url: route(
            'app.document.index',
            { filters: { view: { operator: 'scope', value: 'trash' } } },
            false
          ),
          activePath: '/app/documents?filters[view][value]=trash'
        },
        {
          title: 'Upload',
          url: route('app.document.upload-form', {}, false),
          activePath: '/app/documents/upload-form'
        }
      ]
    },
    {
      title: 'Projekte',
      url: route('app.project.index'),
      icon: KanbanIcon,
      activePath: '/app/projects',
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
      activePath: '/app/invoicing/',
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
          url: route('app.offer.index', { _query: { view: 'all' } }, false),
          activePath: '/app/invoicing/offers',
          items: [
            {
              title: 'Alle Angebote',
              url: route('app.offer.index', { _query: { view: 'all' } }, false),
              activePath: '/app/invoicing/offers?view=all'
            },
            {
              title: 'Entwürfe',
              url: route('app.offer.index', { _query: { view: 'drafts' } }, false),
              activePath: '/app/invoicing/offers?view=drafts'
            },
            {
              title: 'Vorlagen',
              url: route('app.offer.index', { _query: { view: 'templates' } }, false),
              activePath: '/app/invoicing/offers?view=templates'
            }
          ]
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
          title: 'Kontenübersicht 2022',
          url: route(
            'app.bookkeeping.accounts.overview',
            {
              _query: {
                filters: {
                  issuedBetween: {
                    operator: 'scope',
                    value: ['2022-01-01', '2022-12-31']
                  }
                },
                boolean: 'AND'
              }
            },
            false
          ),
          activePath: '/app/bookkeeping/accounts-overview'
        }
      ]
    }
  ],
  navSecondary: [
    {
      title: 'Einstellungen',
      url: route('app.setting', {}, false),
      icon: Settings05Icon,
      activePath: '/app/settings',
      items: [
        {
          title: 'Angebote',
          url: route('app.setting.offer', {}, false),
          activePath: '/app/settings/offers',
          items: [
            {
              title: 'Angebotsabschnitte',
              url: route('app.setting.offer-section.index', {}, false),
              activePath: '/app/settings/offers/offer-sections'
            },
            {
              title: 'Textbausteine',
              url: route('app.setting.text-module.index', {}, false),
              activePath: '/app/settings/offers/text-modules'
            }
          ]
        },
        {
          title: 'Buchhaltung',
          url: route('app.setting.bookkeeping', {}, false),
          activePath: '/app/settings/bookkeeping',
          items: [
            {
              title: 'Buchhaltungskonten',
              url: route('app.bookkeeping.accounts.index', {}, false),
              activePath: '/app/settings/bookkeeping/accounts'
            },
            {
              title: 'Kostenstellen',
              url: route('app.bookkeeping.cost-centers.index', {}, false),
              activePath: '/app/settings/bookkeeping/cost-centers'
            },
            {
              title: 'Regeln',
              url: route('app.bookkeeping.rules.index', {}, false),
              activePath: '/app/settings/bookkeeping/rules'
            }
          ]
        },
        {
          title: 'Dokumente',
          url: route('app.setting.document_type.index', {}, false),
          activePath: '/app/settings/documents',
          items: [
            {
              title: 'Dokumenttypen',
              url: route('app.setting.document_type.index', {}, false),
              activePath: '/app/settings/documents/document-types'
            }
          ]
        },
        {
          title: 'Drucksystem',
          url: route('app.setting.printing-system', {}, false),
          activePath: '/app/settings/printing-system',
          items: [
            {
              title: 'Globales CSS für PDF-Dateien',
              url: route('app.setting.global-css-edit', {}, false),
              activePath: '/app/settings/printing-system/global-css'
            },
            {
              title: 'Briefbögen',
              url: route('app.setting.letterhead.index', {}, false),
              activePath: '/app/settings/printing-system/letterheads'
            },
            {
              title: 'Layouts',
              url: route('app.setting.layout.index', {}, false),
              activePath: '/app/settings/printing-system/layouts'
            }
          ]
        }
      ]
    },
    ...(isAdmin
      ? [
          {
            title: 'Administration',
            url: route('admin', {}, false),
            icon: AccountSetting03Icon,
            activePath: '/admin',
            items: [
              {
                title: 'Benutzer*innen',
                url: route('admin.user.index', {}, false),
                activePath: '/admin/users'
              },
              {
                title: 'Einstellungen',
                url: route('admin.setting.index', {}, false),
                activePath: '/admin/settings'
              }
            ]
          }
        ]
      : [])
  ]
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage().props
  const isAdmin = auth?.user?.is_admin ?? false
  const data = buildNavData(isAdmin)

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
