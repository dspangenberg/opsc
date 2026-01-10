export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: App.Data.UserData
    tenant: App.Data.TenantData
    runningTimer: App.Data.TimeData | null
  }
}
