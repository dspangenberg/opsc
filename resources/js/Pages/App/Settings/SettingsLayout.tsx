/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { SidebarContent } from '@/Components/ui/sidebar'

import { useBreadcrumbProvider } from '@/Components/breadcrumb-provider'
import { useThemeContainer } from '@/Components/theme-container-provider'
import {
  Calendar01Icon,
  ComputerCloudIcon,
  EuroSquareIcon,
  FileEuroIcon,
  Files02Icon,
  GuestHouseIcon,
  MailSetting02Icon,
  NotificationSquareIcon,

} from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react'
import type * as React from 'react'
import { useEffect } from 'react'
import { SettingsLayoutMainMenu } from './SettingsLayoutMainMenu'

export const settings = [
  {
    title: "ecting-Cloud",
    icon: ComputerCloudIcon,
    url: "#",
  },
  {
    title: "E-Mail",
    url: route("app.settings.email.inboxes"),
    icon: MailSetting02Icon,
    activePath: "/app/settings/email",
    items: [
      {
        title: "Inboxen",
        activePath: "/app/settings/email/inboxes",
        url: route("app.settings.email.inboxes"),
      },
      {
        title: "E-Mail-Versand",
        url: route("app.settings.booking.group-of-people"),
        activePath: "/app/settings/booking/group-of-people",
      },
      {
        title: "Signaturen",
        url: route("app.settings.booking.group-of-people"),
        activePath: "/app/settings/booking/group-of-people",
      },
      {
        title: "Layout",
        url: route("app.settings.booking.group-of-people"),
        activePath: "/app/settings/booking/group-of-people",
      },
    ],
  },
  {
    title: "Dokumente",
    icon: Files02Icon,
    url: "#",
  },
  {
    title: "Kalender + Buchungen",
    icon: Calendar01Icon,
    activePath: "/app/settings/booking",
    url: route("app.settings.booking.seasons"),
    items: [
      {
        title: "Saisons",
        activePath: "/app/settings/booking/seasons",
        url: route("app.settings.booking.seasons"),
      },
      {
        title: "Buchungsrichtlinien",
        activePath: "/app/settings/booking/policies",
        url: route("app.settings.booking.policies"),
      },
      {
        title: "Stornorichtlinien",
        activePath: "/app/settings/booking/cancellation-policies",
        url: route("app.settings.booking.cancellation"),
      },
      {
        title: "Feiertage",
        activePath: "/app/settings/policies/booking",
        url: route("app.settings.policies.booking"),
      },
      {
        title: "Ferien",
        activePath: "/app/settings/policies/booking",
        url: route("app.settings.policies.booking"),
      },
    ],
  },
  {
    title: "Fakturierung",
    icon: FileEuroIcon,
    url: "#",
  },
  {
    title: "Benachrichtigungen",
    url: "#",
    icon: NotificationSquareIcon,
  },
  {
    title: "Widgets + API",
    icon: Calendar01Icon,
    url: "#",
  },
]

const SettingsLayout = ({ ...props }) => {
  const { setBreadcrumbs } = useBreadcrumbProvider()
  const { setWidth } = useThemeContainer()

  useEffect(() => {
    setBreadcrumbs([{ title: "Einstellungen", route: route("app.settings.booking.seasons") }])
  }, [])

  useEffect(() => {
    setWidth("7xl")
  }, [setWidth])

  return (
    <div className="mx-auto h-full w-full rounded-xl flex flex-col">
      <div className="flex-1 flex space-x-0 md:space-x-12">
        <div className="w-1/5 flex-none mt-32 hidden lg:flex">
          <SidebarContent>
            <SettingsLayoutMainMenu items={settings} />
          </SidebarContent>
        </div>
        <div className="flex-1">{props.children}</div>
      </div>
    </div>
  )
}

export default SettingsLayout
