/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { AppProvider } from '@/Components/AppProvider'
import { LayoutContainer } from '@/Components/LayoutContainer'
import { AppSidebar } from '@/Components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/Components/ui/sidebar'
import type { PropsWithChildren, ReactNode } from 'react'
import type React from 'react'

export default function AppLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <LayoutContainer className="w-full flex flex-1 flex-col py-4">
            <div className="flex-1 rounded-xl">{children}</div>
          </LayoutContainer>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
