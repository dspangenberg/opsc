/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type * as React from 'react'
import { BreadcrumbProvider } from '@/Components/BreadcrumbProvider'
import { ThemeContainerProvider } from '@/Components/theme-container-provider'
import { ThemeProvider } from '@/Components/theme-provider'
import { NuqsAdapter } from '@/Lib/nuqs-inertia-adapter'
export function AppProvider(props: React.PropsWithChildren) {
  const queryClient = new QueryClient()
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <NuqsAdapter>
        <ThemeContainerProvider width="7xl">
          <BreadcrumbProvider>
            <QueryClientProvider client={queryClient}>
              <div vaul-drawer-wrapper="" className="bg-background">
                {props.children}
              </div>
            </QueryClientProvider>
          </BreadcrumbProvider>
        </ThemeContainerProvider>
      </NuqsAdapter>
    </ThemeProvider>
  )
}
