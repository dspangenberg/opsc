/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useEffect } from 'react'
import { useApplicationProvider } from '@/Components/ApplicationProvider'
import packageJson from '../../../package.json'

export const useAppInitializer = () => {
  const {
    setAppName,
    setAppVersion,
    setAppBuild,
    setAppCopyrightYear,
    appName,
    appVersion,
    appBuild,
    appCopyrightYear
  } = useApplicationProvider()

  useEffect(() => {
    const newAppName = `${import.meta.env.VITE_APP_NAME.replace('.de', '')}`
    const [major, minor, build] = packageJson.version.split('.')

    setAppVersion(`${major}.${minor}`)
    setAppName(newAppName)
    setAppBuild(build)
    setAppCopyrightYear(2024)
  }, [setAppName, setAppVersion, setAppCopyrightYear])

  return { appName, appVersion, appBuild, appCopyrightYear }
}
