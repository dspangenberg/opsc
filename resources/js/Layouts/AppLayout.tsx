/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AppProvider } from '@/Components/AppProvider'
import { LayoutContainer } from '@/Components/LayoutContainer'
import { PageBreadcrumbs } from '@/Components/PageBreadcrumbs'
import { AppSidebar } from '@/Components/app-sidebar'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/Components/ui/sidebar'
import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'
import { useAppInitializer } from '@/Hooks/useAppInitializer'

export default function AppLayout({
  children
}: PropsWithChildren<{ header?: ReactNode }>) {
  // Call the hook directly in the component body
  useAppInitializer()

  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="relative">
          <div className="flex items-center h-12">
            <SidebarTrigger className="p-6" />
            <LayoutContainer className="w-full flex flex-col py-1">
              <PageBreadcrumbs className="hidden md:flex mx-0 px-0" />
            </LayoutContainer>
          </div>
          <div className="absolute top-12 left-0 bottom-0 right-0 bg-sidebar-background overflow-hidden">
            <div className="mt-12">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
