/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import heidelbergImage from '@/Assets/Images/heidelberg.jpeg' // Make sure to adjust the import path
import type React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex">
      <div className="bg-stone-50 h-full w-full overflow-y-none">{children}</div>
    </div>
  )
}

export default AuthLayout
