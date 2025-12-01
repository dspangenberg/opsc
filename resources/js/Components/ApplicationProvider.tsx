import type React from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Logo } from '@/Components/ui/logo'

interface ApplicationProviderState {
  title: string
  logo: React.ReactElement
  appName: string
  appVersion: string
  appWebsite: string
  appBuild: string
  appCopyrightYear: number
  appWithVersion: string // New property
  setTitle: (title: string) => void
  setLogo: (logo: React.ReactElement) => void
  setAppName: (appName: string) => void
  setAppVersion: (appVersion: string) => void
  setAppWebsite: (appWebsite: string) => void
  setAppBuild: (appBuild: string) => void
  setAppCopyrightYear: (appCopyrightYear: number) => void
}

const initialState: ApplicationProviderState = {
  title: 'Default Title',
  logo: <Logo className="size-12 rounded-md" />,
  appName: 'twiceware_app',
  appWebsite: 'https://twiceware.de',
  appVersion: '1.0.0',
  appBuild: '12345',
  appCopyrightYear: new Date().getFullYear(),
  appWithVersion: 'twiceware_app v1.0.0', // Initial value
  setTitle: () => {},
  setLogo: () => {},
  setAppName: () => {},
  setAppVersion: () => {},
  setAppWebsite: () => {},
  setAppCopyrightYear: () => {},
  setAppBuild: () => {}
}

const ApplicationContext = createContext<ApplicationProviderState>(initialState)

export function ApplicationProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<ApplicationProviderState>(initialState)

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }))
  }, [])

  const setLogo = useCallback((logo: React.ReactElement) => {
    setState(prev => ({ ...prev, logo }))
  }, [])

  const setAppCopyrightYear = useCallback((year: number) => {
    setState(prev => ({ ...prev, appCopyrightYear: year }))
  }, [])

  const setAppName = useCallback((appName: string) => {
    setState(prev => ({
      ...prev,
      appName,
      appWithVersion: `${appName} v${prev.appVersion}`
    }))
  }, [])

  const setAppVersion = useCallback((appVersion: string) => {
    setState(prev => ({
      ...prev,
      appVersion,
      appWithVersion: `${prev.appName} ${appVersion}`
    }))
  }, [])

  const setAppWebsite = useCallback((appWebsite: string) => {
    setState(prev => ({ ...prev, appWebsite }))
  }, [])

  const setAppBuild = useCallback((appBuild: string) => {
    setState(prev => ({ ...prev, appBuild }))
  }, [])

  const appWithVersion = useMemo(() => {
    return `${state.appName} ${state.appVersion}`
  }, [state.appName, state.appVersion])

  const value: ApplicationProviderState = {
    ...state,
    appWithVersion,
    setTitle,
    setLogo,
    setAppName,
    setAppVersion,
    setAppCopyrightYear,
    setAppWebsite,
    setAppBuild
  }

  return (
    <ApplicationContext.Provider value={value}>
      <div className="overflow-hidden">{children}</div>
    </ApplicationContext.Provider>
  )
}

export const useApplicationProvider = () => {
  const context = useContext(ApplicationContext)
  if (context === undefined) {
    throw new Error('useApplicationProvider must be used within an ApplicationProvider')
  }
  return context
}

export { initialState }
