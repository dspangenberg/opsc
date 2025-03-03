import heidelbergImage from '@/Assets/Images/heidelberg.jpeg' // Make sure to adjust the import path
import type React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex">
      <div className="relative hidden md:flex flex-none w-3/5">
        <img
          className="absolute h-full w-full object-cover object-right"
          src={heidelbergImage}
          alt="Heidelberg landscape"
        />
        <div className="relative z-20 mt-auto">
          <blockquote className="flex items-center w-full p-6 text-white">
            <span className="pl-1">„Zu reisen ist zu leben." ~ Hans Christian Andersen</span>
          </blockquote>
        </div>
      </div>
      <div className="bg-stone-50 h-full w-full overflow-y-none">{children}</div>
    </div>
  )
}

export default AuthLayout
