import type React from 'react'
import { BubbleBackground } from '@/Components/animate-ui/backgrounds/bubble'
import { SvgBlobAnimation } from '@/Components/animated-blur-blob-background'
import { useAppInitializer } from '@/Hooks/useAppInitializer'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  useAppInitializer()

  return (
    <>
      <SvgBlobAnimation />
      <div className="absolute inset-0 z-40 flex h-screen w-screen items-center justify-center bg-transparent">
        <div className="">{children}</div>
      </div>
    </>
  )
}

export default AuthLayout
