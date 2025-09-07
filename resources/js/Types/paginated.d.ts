/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

declare namespace App.Data.Paginated {
  interface PaginationMetaLink {
    active: boolean
    label: string
    url: string
  }

  interface PaginationMeta<T> {
    current_page: number
    first_page_url
    from: number
    last_page: number
    last_page_url: string
    next_page_url: string
    prev_page_url: string
    links: PaginationMetaLink[]
    path: string
    per_page: number
    to: number
    total: number
    data: T
  }

  export interface Contact extends PaginationMeta {
    data: App.Data.ContactData[]
  }
}
