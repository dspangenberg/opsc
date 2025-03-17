/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import { BreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import { ThemeProvider } from '@/Components/theme-provider'
import { TooltipProvider } from '@/Components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { ThemeContainerProvider } from '@/Components/theme-container-provider'

export function AppProvider(props: React.PropsWithChildren) {
  const queryClient = new QueryClient()

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeContainerProvider width="7xl">
        <BreadcrumbProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider delayDuration={0}>
              <div vaul-drawer-wrapper="" className="bg-background">
                {props.children}
              </div>
            </TooltipProvider>
          </QueryClientProvider>
        </BreadcrumbProvider>
      </ThemeContainerProvider>
    </ThemeProvider>
  )
}
