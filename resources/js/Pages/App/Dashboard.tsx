/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useThemeContainer } from '@/Components/theme-container-provider.tsx'
import type { PageProps } from '@/Types'
import type * as React from 'react'
import { useEffect } from 'react'

const Dashboard: React.FC<PageProps> = ({ auth }) => {
  const { setWidth } = useThemeContainer()

  useEffect(() => {
    setWidth('7xl')
  }, [setWidth])

  return (
    <div className="mx-auto h-full rounded-xl p-8">
      Hi, {auth.user.first_name}
    </div>
  )
}

export default Dashboard
