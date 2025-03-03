/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { AlertDialogProvider } from '@/Components/AlertDialogProvider'
import { CalendarProvider } from '@/Components/CalendarProvider'
import { BreadcrumbProvider } from '@/Components/breadcrumb-provider'
import { ThemeContainerProvider } from '@/Components/theme-container-provider'
import { ThemeProvider } from '@/Components/theme-provider'
import { TooltipProvider } from '@/Components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'

export function AppProvider(props: React.PropsWithChildren) {
  const queryClient = new QueryClient()
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeContainerProvider width="7xl">
        <BreadcrumbProvider>
        <QueryClientProvider client={queryClient}>
          <CalendarProvider calendar={null}>
          <AlertDialogProvider>
            <TooltipProvider delayDuration={0}>
              <div vaul-drawer-wrapper="" className="bg-background">
                {props.children}
              </div>
            </TooltipProvider>
          </AlertDialogProvider>
          </CalendarProvider>
        </QueryClientProvider>‚
        </BreadcrumbProvider>
      </ThemeContainerProvider>

    </ThemeProvider>
  )
}
