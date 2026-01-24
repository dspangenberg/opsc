/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { LockPasswordIcon, Logout02Icon, UserEdit01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import { Pressable } from 'react-aria-components'
import { ThemeSwitch } from '@/Components/theme-switch'
import { Avatar } from '@/Components/twc-ui/avatar'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { BaseMenuItem, MenuHeader, MenuItem, MenuSeparator } from '@/Components/twc-ui/menu'

export function NavUser({ user }: { user: App.Data.UserData }) {
  const handleLogout = () => {
    router.post(route('app.logout', {}, false))
  }
  return (
    <DropdownButton
      menuClassName="min-w-64"
      triggerElement={
        <Pressable>
          <div className="mr-4 flex items-center gap-2" role="button">
            <Avatar
              src={user.avatar_url as unknown as string}
              initials={user.initials}
              fullname={user.full_name}
            />
            <div className="cursor-default font-medium text-sm">{user.full_name}</div>
          </div>
        </Pressable>
      }
    >
      <MenuHeader>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar
            src={user.avatar_url as unknown as string}
            initials={user.initials}
            fullname={user.full_name}
          />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.full_name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
      </MenuHeader>
      <BaseMenuItem>
        <ThemeSwitch />
      </BaseMenuItem>
      <MenuSeparator />

      <MenuItem
        icon={UserEdit01Icon}
        title="Profil ändern"
        ellipsis
        href={route('app.profile.edit')}
      />

      <MenuItem
        icon={LockPasswordIcon}
        title="Kennwort ändern"
        ellipsis
        separator
        href={route('app.profile.change-password')}
      />
      <MenuItem icon={Logout02Icon} title="Logout" onAction={() => handleLogout()} />
    </DropdownButton>
  )
}
