/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
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
  CreditCardChangeIcon,
  CustomerSupportIcon,
  HelpCircleIcon,
  Logout01Icon,
  UserIcon
} from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import type React from 'react'
import packageJson from '../../../package.json'
import { Button } from './ui/button'

export function NavUser({
  user,
}: {
  user: App.Data.UserData
}) {
  const handleLogout = () => {
    router.post(route("app.logout", {}, false))
  }

  const tenant: App.Data.TenantData = usePage().props.auth.tenant
  const [major, minor, build] = packageJson.version.split('.')
  const appName = `${import.meta.env.VITE_APP_NAME.replace('.cloud', '')} ${major}.${minor}.${build}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground size-10 rounded-full"
        >
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={user.avatar_url as unknown as string} alt={user.full_name} />
            <AvatarFallback
              fullname={user.full_name}
              initials={user.initials}
              className="rounded-full"
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side="bottom"
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
            <HugeiconsIcon icon={UserIcon} />
            Profil + Sicherheit
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={CreditCardChangeIcon} />
          Abo + Abrechnung
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="w-4" />
              Hilfe + Support
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <HugeiconsIcon icon={HelpCircleIcon} />
                  Hilfe
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <HugeiconsIcon icon={CustomerSupportIcon} />Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="py-1 font-normal text-xs text-muted-foreground flex items-center gap-1">
                  Support-ID: <span className="font-medium">{tenant.formated_prefix}</span>
                </DropdownMenuLabel>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
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
