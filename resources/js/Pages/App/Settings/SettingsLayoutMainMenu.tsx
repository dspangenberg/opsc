/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'
import type { NavMainItem } from '@/Components/nav-main'
import { Collapsible, CollapsibleTrigger } from '@/Components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/Components/ui/sidebar'
import { usePathActive } from '@/Hooks/usePathActive'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link } from '@inertiajs/react'
import type * as React from 'react'
export function SettingsLayoutMainMenu({
  items
}: {
  items: NavMainItem[]
}) {
  const isPathActive = usePathActive()
  return (
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarMenu>
            {items.map(item => (
              <Collapsible
                key={item.title}
                asChild
                open={isPathActive(item)}
                defaultOpen={isPathActive(item)}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isPathActive(item)}>
                    <CollapsibleTrigger asChild>
                      <Link href={item.url} className="items-center">
                        <HugeiconsIcon icon={item.icon} className="!size-5 text-sidebar-foreground" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </Collapsible>
    </>
  )
}
