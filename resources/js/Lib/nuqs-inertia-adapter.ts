import { router, usePage } from '@inertiajs/react'
import {
  type unstable_AdapterInterface as AdapterInterface,
  type unstable_AdapterOptions as AdapterOptions,
  unstable_createAdapterProvider as createAdapterProvider,
  renderQueryString,
  type unstable_UpdateUrlFunction as UpdateUrlFunction
} from 'nuqs/adapters/custom'
import * as React from 'react'
import { useEffect } from 'react'

function useNuqsInertiaAdapter(): AdapterInterface {
  const currentUrl = usePage().url
  // We need the searchParams to be optimistic to avoid
  // flickering when the internal state is updated
  // but the URL is not yet updated.
  const [searchParams, setSearchParams] = React.useState(
    new URL(`${location.origin}${currentUrl}`).searchParams
  )

  useEffect(() => {
    setSearchParams(new URL(`${location.origin}${currentUrl}`).searchParams)
  }, [currentUrl])

  const updateUrl: UpdateUrlFunction = React.useCallback(
    (search: URLSearchParams, options: AdapterOptions) => {
      const url = new URL(window.location.href)
      url.search = renderQueryString(search)
      setSearchParams(url.searchParams)

      // Server-side request
      if (options?.shallow === false) {
        router.visit(url, {
          replace: options.history === 'replace',
          preserveScroll: !options.scroll,
          preserveState: true,
          async: true
        })
        return
      }

      const method = options.history === 'replace' ? 'replace' : 'push'

      router[method]({
        url: url.toString(),
        clearHistory: false,
        encryptHistory: false,
        preserveScroll: !options.scroll,
        preserveState: true
      })
    },
    []
  )

  return {
    searchParams,
    updateUrl
  }
}

export const NuqsAdapter = createAdapterProvider(useNuqsInertiaAdapter)
