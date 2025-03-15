/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import {TwicewareSolution as TwcuiTwicewareSolution} from '@dspangenberg/twcui'

interface Props {
  hideCopyright?: boolean
}

export const TwicewareSolution: React.FC<Props> = () => {
  const appName = import.meta.env.VITE_APP_NAME.replace('.cloud', '')
  const appWebsite = `https://${appName}`
  return (
    <>
      <TwcuiTwicewareSolution appName={appName} appWebsite={appWebsite} copyrightYear={2024} />
    </>
  )
}
