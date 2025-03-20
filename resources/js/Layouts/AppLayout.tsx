/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AppProvider } from '@/Components/AppProvider'
import { LayoutContainer } from '@/Components/LayoutContainer'
import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { AppSidebar } from '@/Components/AppSidebar'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/Components/ui/sidebar'
import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'
import { useAppInitializer } from '@/Hooks/useAppInitializer'
import { NavUser } from '@/Components/NavUser'
import { usePage } from '@inertiajs/react'
import { SidebarLeftIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export default function AppLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
  useAppInitializer()
  const user: App.Data.UserData = usePage().props.auth.user

  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative border-0">
          <div className="absolute top-0 bottom-12 left-0 right-12 p-2 pointer-event">
            <SidebarTrigger className="size-8 active:border pointer-event">
              <HugeiconsIcon icon={SidebarLeftIcon} className="size-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
          </div>
          <div className="flex items-center h-12 z-20">
            <LayoutContainer className="w-full flex py-1 flex-1 items-center">
              <div className="flex-1">
                <PageBreadcrumbs className="hidden md:flex" />
              </div>
              <div className="flex-none">
                <NavUser user={user} />
              </div>
            </LayoutContainer>
          </div>
          <div className="absolute top-12 left-0 bottom-0 right-0 overflow-hidden  bg-background dark:bg-stone-900 shadow-sm rounded-lg ">
            <div className="mt-6">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
