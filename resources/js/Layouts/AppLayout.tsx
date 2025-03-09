/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AppProvider } from '@/Components/AppProvider'
import { LayoutContainer } from '@/Components/LayoutContainer'
import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { AppSidebar } from '@/Components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/Components/ui/sidebar'
import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'

export default function AppLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="bg- w-full">
          <LayoutContainer className="w-full flex flex-1 flex-col py-3 border-b border-border/50">
            <div className="flex-none flex gap-0 md:gap-2 items-center px-4">
              <SidebarTrigger className="-ml-2" />
              <PageBreadcrumbs className="hidden md:flex" />
            </div>
          </LayoutContainer>
            <LayoutContainer className="w-full flex flex-1 flex-col py-4">
            <div className="flex-1 rounded-xl overflow-y-auto">{children}</div>
          </LayoutContainer>
        </div>
      </SidebarProvider>
    </AppProvider>
  )
}
