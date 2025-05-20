/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { forwardRef, useCallback, useImperativeHandle, useRef, type ReactNode } from 'react'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTabs,
  CredenzaTitle
} from '@/Components/ui/credenza'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { cn } from '@/Lib/utils'

type ReactNodeOrString = ReactNode | string

interface ResponsiveDialogProps {
  children: React.ReactNode
  footer: React.ReactNode
  isOpen: boolean
  showDescription?: boolean
  title?: ReactNodeOrString
  description?: string | ReactNodeOrString
  tabs?: React.ReactNode
  dismissible?: boolean
  className?: string
  onClose: () => void
  width?: 'default' | '4xl'
  hideHeader?: boolean
  backgroundClass?: 'accent' | 'sidebar' | 'background'
  onOpenChange?: (open: boolean) => void
  onInteractOutside?: (event: Event) => void
  onEscapeKeyDown?: (event: React.KeyboardEvent) => void
}

export const ResponsiveDialog = forwardRef<HTMLDivElement, ResponsiveDialogProps>(
  ({
    dismissible = false,
    showDescription = false,
    backgroundClass = 'accent',
    width = 'default',
    hideHeader = false,
    ...props
  }, ref) => {
    const bgClass = {
      accent: 'bg-accent/50',
      sidebar: 'bg-sidebar',
      background: 'bg-background'
    }[backgroundClass]

    const widthClass = {
      default: 'w-full max-w-md',
      '4xl': 'w-4xl min-w-4xl'
    }[width]

    const innerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const handleOpenChange = useCallback((open: boolean) => {
      if (!open) {
        console.log('Dialog closing')
        if (dismissible) {
          props.onClose()
        }
        props.onOpenChange?.(open)
      }
    }, [dismissible, props])


    return (
      <Credenza open={props.isOpen} dismissible={dismissible} onOpenChange={handleOpenChange}>
        <CredenzaContent
          onInteractOutside={props.onInteractOutside}
          className={cn(widthClass, props.className)}
        >
          <CredenzaHeader className={cn(bgClass, hideHeader ? 'sr-only' : '')}>
            <CredenzaTitle>{props.title}</CredenzaTitle>
            {props.description && (
              <CredenzaDescription className="pt-0">
                {!showDescription ? (
                  <VisuallyHidden.Root>{props.description}</VisuallyHidden.Root>
                ) : (
                  <div className="pt-2">{props.description}</div>
                )}
              </CredenzaDescription>
            )}
            {props.tabs && <CredenzaTabs>{props.tabs}</CredenzaTabs>}
          </CredenzaHeader>
          <CredenzaBody>{props.children}</CredenzaBody>
          <CredenzaFooter className={bgClass}>{props.footer}</CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    )
  }
)

ResponsiveDialog.displayName = 'ResponsiveDialog'
