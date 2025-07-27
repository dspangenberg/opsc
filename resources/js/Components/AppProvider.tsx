/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { BreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import { ThemeContainerProvider } from '@/Components/theme-container-provider'
import { ThemeProvider } from '@/Components/theme-provider'
import { TooltipProvider } from '@/Components/ui/tooltip'
import { router } from '@inertiajs/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { useCallback } from 'react'
import { RouterProvider } from 'react-aria-components'

export function AppProvider(props: React.PropsWithChildren) {
  const queryClient = new QueryClient()

  const navigate = useCallback(
    (to: string, options?: Parameters<typeof router.visit>[1]) => router.visit(to, options),
    []
  )
  return (
    <RouterProvider navigate={navigate}>
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
    </RouterProvider>
  )
}
