/*
 * Beleg-Portal is a twiceware solution
 * Copyright (c) 2025 by Rechtsanwalt Peter Trettin
 *
 */

import {AppProvider} from '@/Components/AppProvider'
import {AppSidebar} from '@/Components/AppSidebar'
import {SidebarProvider, SidebarInset, useSidebar} from '@/Components/ui/sidebar'
import type {PropsWithChildren, ReactNode} from 'react'
import type React from 'react'
import {useAppInitializer} from '@/Hooks/useAppInitializer'
import {usePage} from '@inertiajs/react'
import {Toaster} from '@/Components/ui/sonner'
import {LayoutContainer} from '@/Components/LayoutContainer'
import {SidebarLeftIcon} from "@hugeicons/core-free-icons";
import {PageBreadcrumbs} from "@/Components/PageBreadcrumbs";
import {Button} from "@dspangenberg/twcui";
import { NavUser } from '@/Components/NavUser'

const SidebarContent: React.FC<PropsWithChildren> = ({ children }) => {
  const { toggleSidebar } = useSidebar()

  const user: App.Data.UserData = usePage().props.auth.user

  return (
    <>
      <AppSidebar />

      <SidebarInset className="relative border-0">
        <div className="flex items-center h-10 z-20">
          <LayoutContainer className="w-full flex py-1 flex-1 items-center">
            <div className="flex items-center justify-between space-x-2 flex-1">
              <Button variant="outline" icon={SidebarLeftIcon} onClick={toggleSidebar} title="Sidebar umschalten" size="icon-sm"/>
              <PageBreadcrumbs className="hidden md:flex flex-1"/>
              <div className="flex-none">
                <NavUser user={user} />
              </div>
            </div>
          </LayoutContainer>
        </div>
        <div className="absolute top-12 left-0 bottom-0 right-0 bg-background/50 overflow-hidden shadow-sm rounded-lg ">
          <div className="mt-6">{children}</div>
        </div>
        <Toaster position="top-right"/>
      </SidebarInset>
    </>
  )
}

export default function AppLayout({ children }: PropsWithChildren<{ header?: ReactNode }>) {
  useAppInitializer()

  return (
    <AppProvider>
      <SidebarProvider>
        <SidebarContent>
          {children}
        </SidebarContent>
      </SidebarProvider>
    </AppProvider>
  )
}
