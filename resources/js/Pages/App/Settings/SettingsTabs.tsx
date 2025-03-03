/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import type { FC } from 'react'
import { settings } from './SettingsLayout'

interface Props {
  url: string
}

export const SettingsTabs: FC<Props> = ({ url }) => {
  const activeItem = settings.find((item) => item.activePath === url)

  return (
    <NavTabs>
      {activeItem?.items?.map((item) => (
        <NavTabsTab
          key={item.title}
          href={item.url}
          activeRoute={item.activePath || ''}
        >
          {item.title}
        </NavTabsTab>
      ))}
    </NavTabs>
  )
}
