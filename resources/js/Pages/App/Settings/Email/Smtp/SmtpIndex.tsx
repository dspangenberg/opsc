/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { EmptyState } from '@/Components/EmptyState'
import { Toolbar, ToolbarButton } from '@/Components/Toolbar'
import {
  MailSetting01Icon,
} from '@hugeicons-pro/core-stroke-rounded'
import { usePage } from '@inertiajs/react'

import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import type React from 'react'
import SettingsLayout from '../../SettingsLayout'

const handleAdd = () => {
  console.log('Add clicked')
}

const SeasonIndex: React.FC = () => {
  const seasons = usePage().props.seasons as App.Data.SeasonData[]

  return (
    <SettingsLayout>
      <div className="h-full rounded-lg border-stone-100 px-4 flex flex-col">
        <Toolbar
          title="SMTP-Server-Einstellungen"
          className="flex-none"
          tabs={
            <NavTabs>
              <NavTabsTab
                href={route('app.settings.email.inboxes')}
                activeRoute="/app/settings/email/inboxes"
              >
                Inboxen
              </NavTabsTab>
              <NavTabsTab
                href={route('app.settings.email.smtp')}
                activeRoute="/app/settings/email/smtp"
              >
                E-Mail-Versand (SMTP)
              </NavTabsTab>
              <NavTabsTab
                href={route('app.settings.booking.group-of-people')}
                activeRoute="/app/settings/booking/group-of-people"
              >
                Signatur
              </NavTabsTab>
              <NavTabsTab
                href={route('app.settings.booking.group-of-people')}
                activeRoute="/app/settings/booking/group-of-people"
              >
                Gestaltung
              </NavTabsTab>
            </NavTabs>
          }
        >
          <ToolbarButton
            variant="primary"
            label="E-Mail-Versand konfigurieren"
            icon={MailSetting01Icon}
            onClick={handleAdd}
          />
        </Toolbar>
        <div className="flex-none flex">
          <div className="py-6 w-full justify-center space-y-6 items-center text-center rounded-lg text-sm text-muted-foreground">
            <EmptyState
              buttonLabel="E-Mail-Versand konfigurieren"
              buttonIcon={MailSetting01Icon}
              onClick={handleAdd}
              icon={MailSetting01Icon}
            >
              Ups, Du hast noch kein SMTP-Konto hinterlegt
              <br /> und kannst keine E-Mails mit ooboo.cloud versenden.
            </EmptyState>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}

export default SeasonIndex
