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

interface NavTabs extends TabsProps {
  children: ReactNode
}

interface NavTabsTab extends InertiaLinkProps {
  children: ReactNode
  activeRoute: string
}

export const NavTabs: React.FC<NavTabs> = ({ children, ...props }: NavTabs) => {
  return (
    <Tabs   {...props}>
      <TabsList className="justify-start w-full inline-flex items-center text-base rounded-none bg-transparent p-0.5 text-muted-foreground/70 gap-4">
        {children}
      </TabsList>
    </Tabs>
  )
}

export const NavTabsTab: React.FC<NavTabsTab> = ({
  children,
  activeRoute,
  href,
  ...props
}: NavTabsTab) => {
  const isPathActive = usePathActive()

  return (
    <Link
      href={href}
      {...props}
      role="tab"
      aria-selected={isPathActive(activeRoute)}
      className={cn(
        'relative after:absolute after:inset-x-0 text-foreground after:-bottom-1 after:h-[2px]  hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent',
        isPathActive(activeRoute) && 'bg-transparent after:bg-primary text-primary font-bold'
      )}
    >
      {children}
    </Link>
  )
}
