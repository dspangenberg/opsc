export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: App.Data.UserData
    tenant: App.Data.TenantData
  }
}

export interface IKeyValueStore {
  [key: string]: string
}

export interface IKeyValueMulitTypeStore {
  [key: string]: number | string | boolean | undefined | null
}
