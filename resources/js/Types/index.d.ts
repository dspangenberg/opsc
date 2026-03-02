export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: App.Data.UserData
    tenant: App.Data.TenantData
    runningTimer: App.Data.TimeData | null
    bookmarks: App.Data.BookmarkData[]
    bookmarkFolders: App.Data.BookmarkFolderData[]
    email_accounts: App.Data.EmailAccountData[]
  }
}
