import type React from 'react'
import { useAppInitializer } from '@/Hooks/useAppInitializer'
import { BubbleBackground } from '@/Components/animate-ui/backgrounds/bubble'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  useAppInitializer()

  return (
    <>



      <div className="h-screen w-screen flex">
        <BubbleBackground colors={{ first: '18,113,255', second: '221,74,255', third: '0,220,255', fourth: '200,50,50', fifth: '180,180,50', sixth: '140,100,255', }}
        >
        <div className="">
          {children}
        </div>
        </BubbleBackground>
      </div>

    </>
  )
}

export default AuthLayout
