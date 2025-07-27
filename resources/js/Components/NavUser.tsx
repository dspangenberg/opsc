/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { router } from '@inertiajs/react'

import { ThemeSwitch } from '@/Components/theme-switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Avatar, Button } from '@dspangenberg/twcui'
import { Door01Icon, Settings05Icon, UserIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export function NavUser({
  user
}: {
  user: App.Data.UserData
}) {
  const handleLogout = () => {
    router.post(route('app.logout', {}, false))
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="mr-4 flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Avatar
              src={user.avatar_url as unknown as string}
              initials={user.initials}
              fullname={user.full_name}
            />
          </Button>
          <div className="cursor-default font-medium text-sm">{user.full_name}</div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
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
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="py-1 font-normal">
          <ThemeSwitch />
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} />
            Profil + Sicherheit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon icon={Settings05Icon} />
            Einstellungen
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <HugeiconsIcon icon={Door01Icon} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
