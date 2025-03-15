/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'

import { TwicewareSolution } from '@/Components/TwicewareSolution'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import { cn } from '@/Lib/utils'
import { useApplicationProvider } from '@/Components/ApplicationProvider'

interface AuthContainerProps {
  title: string
  cardTitle?: string
  cardDescription: string
  maxWidth?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  appName?: string
  logo: React.ReactElement
  appVersion?: string
  className?: string
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  logo,
  cardDescription = '',
  cardTitle = title,
  className = '',
  maxWidth = 'lg',
  children,
  ...props
}) => {
  const containerClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg px-6'
  }[maxWidth]

  const { appWithVersion } = useApplicationProvider()

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a
            href="#"
            className="flex items-center gap-3 self-center font-medium flex-col"
          >
            <div className="flex items-center justify-center    ">{logo}</div>
            {appWithVersion}
          </a>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{cardTitle}</CardTitle>
              <CardDescription className="text-base">
                Melde Dich mit Deinen Zugangsdaten an
              </CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>

          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            <TwicewareSolution />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthContainer
