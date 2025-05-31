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
import { BorderedBox } from './twcui/bordered-box'

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

  const { appWithVersion, appName, appVersion, appBuild, appWebsite, appCopyrightYear } = useApplicationProvider()

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className={cn('flex w-full max-w-sm flex-col gap-3', containerSize)}>
          <div className="items-center flex flex-col gap-1 z-50">
            <a href={appWebsite} target="_blank" className="text-center" rel="noreferrer">{logo}</a>
            <div className="p-2 font-medium">
            {appWithVersion}
            </div>
          </div>
          <BorderedBox className="bg-page-content/50">
          <Card className="rounded-lg border-0 shadow-none">
            <CardHeader className="text-center">

              <CardTitle className="text-xl">{cardTitle}</CardTitle>
              <CardDescription className="text-base">{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">{children}
              <div className="text-xxs p-0 text-center">
                {appVersion}.{appBuild}
              </div>
            </CardContent>

</Card>
          </BorderedBox>

          <div className="text-balance z-50 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">

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
