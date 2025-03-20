/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaPortal,
  CredenzaTabs,
  CredenzaTitle
} from '@/Components/ui/credenza'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import type * as React from 'react'
import { type ReactNode, forwardRef } from 'react'

type ReactNodeOrString = ReactNode | string

interface ResponsiveDialogProps {
  children: React.ReactNode
  footer: React.ReactNode
  isOpen: boolean
  showDescription?: boolean
  title: ReactNodeOrString
  description?: string | ReactNodeOrString
  tabs?: React.ReactNode
  dismissible?: boolean
  className?: string
  onClose: () => void
  onOpenChange?: (open: boolean) => void
  onInteractOutside?: (event: Event) => void
}

export const ResponsiveDialog = forwardRef<HTMLDivElement, ResponsiveDialogProps>(
  ({ dismissible = false, showDescription = false, ...props }, ref) => {
    return (
      <Credenza open={props.isOpen} dismissible={dismissible} onOpenChange={props.onOpenChange}>
        <CredenzaContent
          ref={ref}
          onInteractOutside={props.onInteractOutside}
          className={props.className}
        >
          <CredenzaHeader>
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
          <CredenzaFooter>{props.footer}</CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    )
  }
)

ResponsiveDialog.displayName = 'ResponsiveDialog'
