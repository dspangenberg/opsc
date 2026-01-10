/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { PageProps as InertiaPageProps } from '@inertiajs/core'
import type { AxiosInstance } from 'axios'
import type { route as ziggyRoute } from 'ziggy-js'
import type { PageProps as AppPageProps } from './'

declare global {
  interface Window {
    axios: AxiosInstance
  }

  type IconSvgElement = readonly (readonly [
    string,
    {
      readonly [key: string]: string | number
    }
  ])[]

  const route: typeof ziggyRoute
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, AppPageProps {}
  export interface InertiaConfig {
    errorValueType: string[]
    flashDataType: Record<string, any> & {
      toast?: { type: 'success' | 'error'; message: string }
    }
    sharedPageProps: {
      auth: { user: User | null }
    }
  }
}
