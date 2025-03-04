/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { router, usePage } from '@inertiajs/react'

import { Logo } from '@/Components/Logo'
import { ThemeSwitch } from '@/Components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import {
  Logout01Icon,
  NotificationSquareIcon,
  Settings05Icon,
  UserIcon
} from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronsUpDown } from 'lucide-react'
import type React from 'react'
import packageJson from '../../../package.json'
import { SidebarMenuButton, useSidebar } from './ui/sidebar'

export function NavUser({
  user,
}: {
  user: App.Data.UserData
}) {
  const handleLogout = () => {
    router.post(route("app.logout", {}, false))
  }

  const { isMobile } = useSidebar()
  const tenant: App.Data.TenantData = usePage().props.auth.tenant
  const [major, minor, build] = packageJson.version.split('.')
  const appName = `${import.meta.env.VITE_APP_NAME.replace('.cloud', '')} ${major}.${minor}.${build}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={user.avatar_url as unknown as string} alt={user.full_name} />
            <AvatarFallback
              fullname={user.full_name}
              initials={user.initials}
              className="rounded-full"
            />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.full_name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 1731247785399.png ">
              <AvatarImage src={user.avatar_url as unknown as string} alt={user.full_name} />
              <AvatarFallback
                fullname={user.full_name}
                initials={user.initials}
                className="rounded-full"
              />
            </Avatar>
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
            <HugeiconsIcon icon={NotificationSquareIcon} />
            Benachrichtigungen
          </DropdownMenuItem>
        </DropdownMenuGroup>

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
          <HugeiconsIcon icon={Logout01Icon} />
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="py-1 font-normal text-xs text-muted-foreground flex items-center gap-1">
          <Logo className="size-4 rounded-md mx-0.5" /> {appName}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
