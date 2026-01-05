/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { HugeiconsIcon, type HugeiconsProps } from '@hugeicons/react'
import { Link } from '@inertiajs/react'
import type { LucideIcon } from 'lucide-react'
import type * as React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/Components/ui/sidebar'
import { usePathActive } from '@/Hooks/usePathActive'
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
  hasSep?: boolean
  exact?: boolean
  items?: NavMainItemChildren[]
}

export function NavSecondary({ items, ...props }: { className?: string; items: NavMainItem[] }) {
  const isPathActive = usePathActive()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            // Für Collapsible: Hauptelement oder eines seiner Sub-Items ist aktiv
            const isItemOrChildActive = isPathActive(item, false, item.items)

            return (
              <Collapsible key={item.title} asChild open={isItemOrChildActive}>
                <SidebarMenuItem className={item.hasSep ? 'mb-3' : ''}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isPathActive(item)}>
                      <Link href={item.url}>
                        <HugeiconsIcon
                          icon={item.icon}
                          size={24}
                          color="currentColor"
                          className="size-5! text-sidebar-foreground!"
                        />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub className="block">
                        {item.items.map(subItem => {
                          const isSubOrChildActive = isPathActive(subItem, false, subItem.items)

                          if (subItem.items?.length) {
                            return (
                              <Collapsible key={subItem.title} asChild open={isSubOrChildActive}>
                                <SidebarMenuSubItem className={subItem.hasSep ? 'mb-3' : ''}>
                                  <CollapsibleTrigger asChild>
                                    <SidebarMenuSubButton
                                      asChild
                                      className="ml-1"
                                      isActive={isPathActive(subItem)}
                                    >
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </CollapsibleTrigger>
                                  <CollapsibleContent>
                                    <SidebarMenuSub className="ml-3 block">
                                      {subItem.items.map(child => (
                                        <SidebarMenuSubItem
                                          key={child.title}
                                          className={child.hasSep ? 'mb-3' : ''}
                                        >
                                          <SidebarMenuSubButton
                                            asChild
                                            className="ml-1"
                                            isActive={isPathActive(child)}
                                          >
                                            <Link href={child.url}>
                                              <span>{child.title}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      ))}
                                    </SidebarMenuSub>
                                  </CollapsibleContent>
                                </SidebarMenuSubItem>
                              </Collapsible>
                            )
                          }

                          return (
                            <SidebarMenuSubItem
                              key={subItem.title}
                              className={subItem.hasSep ? 'mb-3' : ''}
                            >
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
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
