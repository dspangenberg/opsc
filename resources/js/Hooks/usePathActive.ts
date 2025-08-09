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

  console.log(route().current())
  console.log(route().queryParams)

  const checkIsActive = useCallback(
    (item: PathActiveItem | string) => {
      if (typeof item === 'string') {
        if (item.includes('?')) {
          const [itemPath, itemQuery] = item.split('?')
          const [currentPath, currentQuery = ''] = url.split('?')

          // Pfad muss übereinstimmen
          if (!currentPath.startsWith(itemPath)) {
            return false
          }

          // Query-Parameter überprüfen
          const itemParams = new URLSearchParams(itemQuery)
          const currentParams = new URLSearchParams(currentQuery)

          // Alle erforderlichen Parameter müssen vorhanden und korrekt sein
          for (const [key, value] of itemParams) {
            if (currentParams.get(key) !== value) {
              return false
            }
          }

          return true
        }
        return url.startsWith(item)
      }

      if (item.activePath === undefined) {
        return item.isActive || false
      }
      if (item.exact) {
        return item.url === url
      }

      // Für PathActiveItem auch Query-Parameter überprüfen
      if (item.activePath?.includes('?')) {
        const [itemPath, itemQuery] = item.activePath.split('?')
        const [currentPath, currentQuery = ''] = url.split('?')

        if (!currentPath.startsWith(itemPath)) {
          return false
        }

        const itemParams = new URLSearchParams(itemQuery)
        const currentParams = new URLSearchParams(currentQuery)

        for (const [key, value] of itemParams) {
          if (currentParams.get(key) !== value) {
            return false
          }
        }

        return true
      }

      return url.startsWith(item.activePath!)
    },
    [url]
  )

  const checkIsActiveOrHasActiveChild = useCallback(
    (item: PathActiveItem | string, children?: Array<PathActiveItem | string>) => {
      // Hauptelement selbst prüfen
      if (checkIsActive(item)) {
        return true
      }

      // Sub-Items prüfen, falls vorhanden
      if (children && children.length > 0) {
        return children.some(child => checkIsActive(child))
      }

      return false
    },
    [checkIsActive]
  )

  return useCallback(
    (item: PathActiveItem | string, debug?: boolean, children?: Array<PathActiveItem | string>) => {
      if (debug === true) console.log(item, url)

      // Wenn children übergeben werden, prüfe auch diese
      if (children) {
        return checkIsActiveOrHasActiveChild(item, children)
      }

      return checkIsActive(item)
    },
    [url, checkIsActive, checkIsActiveOrHasActiveChild]
  )
}
