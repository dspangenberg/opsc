/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AppProvider } from '@/Components/AppProvider'
import { LayoutContainer } from '@/Components/LayoutContainer'
import { AppSidebar } from '@/Components/app-sidebar'
import { NavUser } from '@/Components/nav-user'
import { Button } from '@/Components/ui/button'

import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar'
import { Notification02Icon } from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import { usePage } from '@inertiajs/react'
import type React from 'react'
import type { PropsWithChildren, ReactNode } from 'react'
export default function AppLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
  const user: App.Data.UserData = usePage().props.auth.user
  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <LayoutContainer as="header" className="flex w-full items-center gap-0 md:gap-2 relative py-1">
            <div className="flex-none flex gap-0 md:gap-2 items-center ">
              <SidebarTrigger className="-ml-2" />
              <PageBreadcrumbs className="hidden md:flex" />
            </div>
            <div className="flex-auto text-right justify-end flex">
              <div className="space-x-2 space-y-0 flex items-center text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground size-10 rounded-full"
                >
                  <HugeiconsIcon icon={Notification02Icon} className="h-6 w-6 text-blue-500" />
                </Button>
                <NavUser user={user} />
              </div>
            </div>
          </LayoutContainer>
          <LayoutContainer className='w-full flex flex-1 flex-col py-4'>
            <div className="flex-1 rounded-xl">{children}</div>
          </LayoutContainer>
        </div>
      </SidebarProvider>
    </AppProvider>
  )
}
