/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/Components/ui/sidebar'
import { usePathActive } from '@/Hooks/usePathActive'
import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'
import { Link, usePage } from '@inertiajs/react'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import type * as React from 'react'
export type CombinedIcon = LucideIcon | React.FC<HugeiconsProps>

export interface NavMainItem {
  title: string
  url: string
  icon: globalThis.IconSvgElement
  hasSep?: boolean
  activePath?: string
  isActive?: boolean
  exact?: boolean
  items?: NavMainItemChildren[]
}

export interface NavMainItemChildren {
  title: string
  url: string
  activePath?: string
  isActive?: boolean
  exact?: boolean
}

export function NavMain({
  items,
  ...props
}: {
  items: NavMainItem[]
}) {
  const isPathActive = usePathActive()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <Collapsible key={item.title} asChild open={isPathActive(item)}>
              <SidebarMenuItem className={item.hasSep ? 'mb-3' : ''}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isPathActive(item)}>
                    <Link href={item.url}>
                      <HugeiconsIcon icon={item.icon} size={24} color="currentColor" className="!size-5 !text-sidebar-foreground" />
                      <span className="text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items?.length ? (
                  <>
                    <CollapsibleContent>
                      <SidebarMenuSub className="block md:hidden">
                        {item.items.map(subItem => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="ml-1"
                              isActive={isPathActive(subItem)}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
