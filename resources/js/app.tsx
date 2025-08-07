/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import '../css/app.css'
import './bootstrap'
import '@fontsource/clear-sans/100.css'
import '@fontsource/clear-sans/300.css'
import '@fontsource/clear-sans/400.css'
import '@fontsource/clear-sans/500.css'
import '@fontsource/clear-sans/700.css'

import 'mapbox-gl/dist/mapbox-gl.css'
import * as Sentry from '@sentry/react'

import { ApplicationProvider } from '@/Components/ApplicationProvider'
import AppLayout from '@/Layouts/AppLayout'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { createRoot } from 'react-dom/client'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'
const sentryEnabled = import.meta.env.VITE_SENTRY_ENABLED === 'true'
const sentryDsn = import.meta.env.VITE_SENTRY_DNS

if (sentryEnabled && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn
  })
}

globalThis.resolveMomentumModal = name => {
  const pages = import.meta.glob('./Pages/**/*.tsx')
  return pages[`./Pages/${name}.tsx`]
}

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: async name => {
    const page = await resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx')
    )

    // @ts-ignore
    page.default.layout = name.startsWith('App') ? page => <AppLayout>{page}</AppLayout> : undefined

    return page
  },
  setup({ el, App, props }) {
    const root = createRoot(el)
    root.render(
      <ApplicationProvider>
        <App {...props} />
      </ApplicationProvider>
    )
  },
  progress: {
    color: '#4B5563'
  }
})
