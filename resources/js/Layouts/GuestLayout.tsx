import type React from 'react'
import { useAppInitializer } from '@/Hooks/useAppInitializer'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  useAppInitializer()

  return (
    <div className="h-screen w-screen flex">
      <div className="bg-stone-50 h-full w-full overflow-y-none">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
