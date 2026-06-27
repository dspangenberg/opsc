import { configureEcho } from '@laravel/echo-react'
import '../css/app.css'
import './bootstrap'
import '@fontsource/clear-sans/100.css'
import '@fontsource/clear-sans/300.css'
import '@fontsource/clear-sans/400.css'
import '@fontsource/clear-sans/500.css'
import '@fontsource/clear-sans/700.css'

import { createInertiaApp } from '@inertiajs/react'
import * as Sentry from '@sentry/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import type { JSXElementConstructor, ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ApplicationProvider } from '@/Components/ApplicationProvider'
import AppLayout from '@/Layouts/AppLayout'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'
const sentryEnabled = import.meta.env.VITE_SENTRY_ENABLED === 'true'
const sentryDsn = import.meta.env.VITE_SENTRY_DNS

configureEcho({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss']
})

if (sentryEnabled && sentryDsn) {
  Sentry.init({
    dsn: sentryDsn
  })
}

globalThis.resolveMomentumModal = async name => {
  const pages = import.meta.glob('./Pages/**/*.tsx')
  const path = `./Pages/${name}.tsx`
  const module = pages[path]
  return module ? await module() : null
}

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: async name => {
    const page: any = await resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx')
    )

    page.default.layout =
      name.startsWith('App') || name.startsWith('Admin')
        ? (page: ReactElement<unknown, string | JSXElementConstructor<any>>) => (
            <AppLayout>{page}</AppLayout>
          )
        : undefined

    return page
  },
  defaults: {
    visitOptions: (href, options) => {
      return { viewTransition: true }
    }
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
