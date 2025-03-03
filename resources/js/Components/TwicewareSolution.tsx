/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { Logo } from './Logo' // Assuming you have converted this component to React as well

interface Props {
  hideCopyright?: boolean
}

const TwicewareSolution: React.FC<Props> = ({ hideCopyright = false }) => {
  const appName = import.meta.env.VITE_APP_NAME.replace('.cloud', '')
  const appWebsite = `https://${appName}`
  return (
    <>
      <div className="w-[320px] mx-auto flex items-center justify-center">
        <a
          href={appWebsite}
          className="font-medium hover:underline flex items-center"
          target="_blank"
          rel="noreferrer"
        >
          {appName}
        </a>
        is a
        <Logo className="size-5 rounded-md mx-1.5" />
        <a href="https://twiceware.de" className="hover:underline" target="_blank" rel="noreferrer">
          twiceware solution
        </a>
      </div>
      {!hideCopyright && (
        <div className="text-xs text-center text-stone-400 mt-1 mx-auto">
          Copyright &copy; 2024-{new Date().getFullYear()}
        </div>
      )}
    </>
  )
}

export default TwicewareSolution
