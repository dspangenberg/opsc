/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '@/Components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger
} from '@/Components/ui/drawer'
import { useMediaQuery } from '@/Hooks/use-media-query'
import { cn } from '@/Lib/utils'
import React from 'react';

interface BaseProps {
  children: React.ReactNode
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean
  dismissible?: boolean
  onOpenChange?: (open: boolean) => void
}

interface CredenzaPortalProps extends BaseProps {
  forceMount?: boolean
  container?: HTMLElement
}


interface CredenzaProps extends BaseProps {
  className?: string
  onInteractOutside?: (event: Event) => void
  asChild?: boolean
}

const desktop = '(min-width: 768px)'

const Credenza = ({ children, ...props }: RootCredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const Credenza = isDesktop ? Dialog : Drawer
  return <Credenza {...props}>{children}</Credenza>
}

const CredenzaPortal = ({ children, forceMount = false, ...props }: CredenzaPortalProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaPortalComponent = isDesktop? DialogPortal : DrawerPortal

  return (
    <>
      <CredenzaPortalComponent {...props}>
        {children}
      </CredenzaPortalComponent>
    </>
  )
}

const CredenzaTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaTrigger = isDesktop ? DialogTrigger : DrawerTrigger

  return (
    <CredenzaTrigger className={className} {...props}>
      {children}
    </CredenzaTrigger>
  )
}

const CredenzaClose = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaClose = isDesktop ? DialogClose : DrawerClose

  return (
    <CredenzaClose className={className} {...props}>
      {children}
    </CredenzaClose>
  )
}

const CredenzaContent = React.forwardRef<HTMLDivElement, CredenzaProps>(
  ({ className, children, ...props }, ref) => {
    const isDesktop = useMediaQuery(desktop)
    const CredenzaContentComponent = isDesktop ? DialogContent : DrawerContent
    return (
      <CredenzaContentComponent ref={ref} className={cn('overflow-hidden', className)} {...props}>
        {children}
      </CredenzaContentComponent>
    )
  }
)

const CredenzaDescription = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaDescription = isDesktop ? DialogDescription : DrawerDescription

  return (
    <CredenzaDescription className={className} {...props}>
      {children}
    </CredenzaDescription>
  )
}

const CredenzaTabs = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className="flex-1 flex w-full" {...props}>
      {children}
    </div>
  )
}

const CredenzaHeader = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaHeader = isDesktop ? DialogHeader : DrawerHeader

  return (
    <CredenzaHeader className={className} {...props}>
      {children}
    </CredenzaHeader>
  )
}

const CredenzaTitle = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaTitle = isDesktop ? DialogTitle : DrawerTitle

  return (
    <CredenzaTitle className={className} {...props}>
      {children}
    </CredenzaTitle>
  )
}

const CredenzaBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn('px-4 overflow-y-auto', className)} {...props} >
      {children}
    </div>
  )
}

const CredenzaFooter = ({ className, children, ...props }: CredenzaProps) => {
  const isDesktop = useMediaQuery(desktop)
  const CredenzaFooter = isDesktop ? DialogFooter : DrawerFooter

  return (
    <CredenzaFooter className={className} {...props}>
      {children}
    </CredenzaFooter>
  )
}

export {
  Credenza,
  CredenzaTrigger,
  CredenzaClose,
  CredenzaContent,
  CredenzaTabs,
  CredenzaDescription,
  CredenzaPortal,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaBody,
  CredenzaFooter
}
