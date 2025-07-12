/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Head } from '@inertiajs/react'
import type React from 'react'
import { cn } from '@/Lib/utils'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card'
import { useApplicationProvider } from '@/Components/ApplicationProvider'
import { TwicewareSolution } from '@dspangenberg/twcui'

interface AuthContainerProps {
  title: string
  cardTitle?: string
  cardDescription?: string
  maxWidth?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  appName?: string
  logo?: React.ReactElement
  appVersion?: string
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  logo,
  cardDescription = '',
  cardTitle = title,
  maxWidth = 'sm',
  children
}) => {
  const containerSize = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg px-6'
  }[maxWidth]

  const { appWithVersion, appName, appWebsite, appCopyrightYear } = useApplicationProvider()

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className={cn('flex w-full max-w-sm flex-col gap-6', containerSize)}>

          <Card className='z-50 bg-white'>
            <CardHeader className="text-center">
              <div className='flex flex-col items-center justify-center gap-1'>
                <a href={appWebsite} target="_blank" className="text-center" rel="noreferrer">{logo}</a>
                {appWithVersion}
              </div>
              <CardTitle className="text-xl">{cardTitle}</CardTitle>
              <CardDescription className="text-base">{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>

          <div className='z-50 text-balance text-center text-muted-foreground text-xs [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary '>
            <TwicewareSolution
              appName={appName}
              appWebsite={appWebsite}
              copyrightYear={appCopyrightYear}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthContainer
