/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'
import packageJson from '../../../package.json'
import { Logo } from './Logo'
import TwicewareSolution from './TwicewareSolution'

interface AuthContainerProps {
  title: string
  maxWidth?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const AuthContainer: React.FC<AuthContainerProps> = ({ title, maxWidth = 'lg', children }) => {
  const containerClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg px-6'
  }[maxWidth]

  const edition = import.meta.env.VITE_APP_NAME.includes('.cloud') ? 'Cloud' : 'Open Source'

  const [major, minor, build] = packageJson.version.split('.')
  const appName = `${import.meta.env.VITE_APP_NAME.replace('.cloud', '')} ${major}.${minor}`

  return (
    <div
      className={`container w-full mx-auto h-screen bg-background overflow-y-auto items-start mb-12 lg:py-0 flex justify-center lg:items-center auth-container ${containerClasses}`}
    >
      <Head title={title} />
      <div className="text-stone-700 text-base font-medium flex-1">
        <div className="mt-4 h-12 mb-0 text-center">
          <Logo className="size-8 mx-auto rounded-md animate-flip-up animate-once animate-delay-1000" />
        </div>

        <h1 className="text-xl font-bold text-black pt-0.5 text-center">{appName} &mdash; {title}</h1>
        <div className="text-xs font-normal text-stone-700 pt-2 text-center">
          <span className="font-medium">{edition}-Edition</span> #{build}
        </div>

        <div className="py-6 px-1">{children}</div>

        <TwicewareSolution />
      </div>
    </div>
  )
}

export default AuthContainer
