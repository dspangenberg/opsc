/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Tabs, TabsList } from '@/Components/ui/tabs'
import { usePathActive } from '@/Hooks/usePathActive'
import { cn } from '@/Lib/utils'
import { type InertiaLinkProps, Link } from '@inertiajs/react'
import type { TabsProps } from '@radix-ui/react-tabs'
import type React from 'react'
import type { ReactNode } from 'react'

interface ClassicNavTabs extends TabsProps {
  children: ReactNode
}

interface ClassicNavTabsTab extends InertiaLinkProps {
  children: ReactNode
  activeRoute: string
}

export const ClassicNavTabs: React.FC<ClassicNavTabs> = ({
  children,
  ...props
}: ClassicNavTabs) => {
  return (
    <Tabs {...props} className="w-full flex flex-full  relative">
      <TabsList className="w-full inline-flex items-center justify-start rounded-md  bg-background">
        {children}
      </TabsList>
    </Tabs>
  )
}

export const ClassicNavTabsTab: React.FC<ClassicNavTabsTab> = ({
  children,
  activeRoute,
  href,
  ...props
}: ClassicNavTabsTab) => {
  const isPathActive = usePathActive()

  return (
    <Link
      href={href}
      {...props}
      role="tab"
      data-state={isPathActive(activeRoute) ? 'active' : 'inactive'}
      aria-selected={isPathActive(activeRoute)}
      className={cn(
        'flex  border-0 bg-transparent border-border items-center font-normal rounded-none px-4 py-0 select-none text-base h-9 flex-none data-[state=active]:rounded-t-sm text-foreground hover:underline cursor-pointer shadow-none',
        'data-[state=active]:border data-[state=active]:bg-page-content data-[state=active]:border-border/50 data-[state=active]:border-b-page-content data-[state=active]:-mb-[2px] data-[state=active]:text-foreground data-[state=active]:font-medium z-50',
        'disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:text-muted-foreground'
      )}
    >
      {children}
    </Link>
  )
}
