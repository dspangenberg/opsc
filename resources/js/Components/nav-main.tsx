'use client'
import { useState, useEffect } from 'react'
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
import { HugeiconsIcon  } from '@hugeicons/react'
import { Link } from '@inertiajs/react'
import type * as React from 'react'

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
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const initialOpenState = items.reduce((acc, item) => {
      acc[item.title] = isActive(item)
      return acc
    }, {} as { [key: string]: boolean })
    setOpenItems(initialOpenState)
  }, [items])

  const isActive = (item: NavMainItem) => {
    if (item.isActive) {
      return true
    }
    return isPathActive(item.url)
  }

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <Collapsible
              key={item.title}
              asChild
              open={openItems[item.title]}
              onOpenChange={() => toggleItem(item.title)}
            >
              <SidebarMenuItem className={item.hasSep ? 'mb-3' : ''}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={isActive(item)}>
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
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
