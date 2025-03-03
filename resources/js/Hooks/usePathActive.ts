/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { usePage } from '@inertiajs/react'
import { useCallback } from 'react'

interface PathActiveItem {
  url: string
  activePath?: string
  isActive?: boolean
  exact?: boolean
}

export function usePathActive() {
  const url = usePage().url

  return useCallback(
    (item: PathActiveItem | string, debug?: boolean) => {
      if (typeof item === 'string') {
        return url.startsWith(item)
      }

      if (debug === true) console.log(item, url)
      if (item.activePath === undefined) {
        return item.isActive || false
      }
      if (item.exact) {
        return item.url === url
      }
      return url.startsWith(item.activePath)
    },
    [url]
  )
}
