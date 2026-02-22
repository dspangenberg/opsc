import type { PageProps as InertiaPageProps } from '@inertiajs/core'
import type { AxiosInstance } from 'axios'
import type { route as routeFn } from 'ziggy-js'
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

  const route: typeof routeFn
}

declare module '@inertiajs/core' {
  interface PageProps extends InertiaPageProps, AppPageProps {}
  export interface InertiaConfig {
    errorValueType: string[]
    flashDataType: Record<string, any> & {
      toast?: { type: 'success' | 'error'; message: string }
    }
    sharedPageProps: {
      user: App.Data.UserData
      tenant: App.Data.TenantData
      runningTimer: App.Data.TimeData | null
      bookmarks: App.Data.BookmarkData[]
      bookmarkFolders: App.Data.BookmarkFolderData[]
    }
  }
}
