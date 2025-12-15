/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { cn } from '@/Lib/utils'
import { HeadlessModal, type HeadlessModalProps } from '@inertiaui/modal-react'
import type { ReactNode } from 'react'
import type React from 'react'
import { forwardRef, useRef } from 'react'

type ReactNodeOrString = ReactNode | string

export interface Props {
  children: ReactNode
  footer: ((handleFooterEvents?: (isCancel?: boolean) => void) => ReactNode) | ReactNode
  title: ReactNodeOrString
  description?: ReactNodeOrString
  dismissible?: boolean
  showDescription?: boolean
  className?: string
  tabs?: React.ReactNode
  confirmClose?: boolean
  confirmationTitle?: string
  confirmationMessage?: string
  confirmationButtonTitle?: string
  confirmationVariant?: 'default' | 'destructive'
  onClose?: () => void
  onClosed?: () => void
  onOpenChange?: (open: boolean) => void
  onInteractOutside?: (event: Event) => void
}

export const InertiaDialog = forwardRef<HTMLDivElement, Props>(props => {
  const {
    children,
    footer,
    title,
    tabs,
    description,
    dismissible = true,
    showDescription = false,
    confirmClose = false,
    confirmationTitle = 'Änderungen verwerfen',
    confirmationMessage = 'Möchtest Du die Änderungen verwerfen?',
    confirmationButtonTitle = 'Verwerfen',
    confirmationVariant = 'default',
    onInteractOutside,
    className,
    onClose,
    onClosed
  } = props
  const modalRef = useRef<HeadlessModalProps>(null)

  // Wird aufgerufen wenn der Dialog tatsächlich geschlossen wird
  const handleOnClosed = () => {
    console.log('Dialog geschlossen')
    // Nur onClose aufrufen - afterLeave wird automatisch von HeadlessModal aufgerufen
    if (onClosed) {
      onClosed()
    }
  }

  const handleInteractOutside = (event: Event) => {
    if (!dismissible) {
      event.preventDefault()
      return
    }

    if (onInteractOutside) {
      onInteractOutside(event)
    }
  }

  return (
    <HeadlessModal ref={modalRef} {...props}>
      {({ isOpen }: HeadlessModalProps) => (
        <Dialog
          isOpen={isOpen}
          onInteractOutside={handleInteractOutside}
          confirmClose={confirmClose}
          confirmationTitle={confirmationTitle}
          confirmationMessage={confirmationMessage}
          confirmationButtonTitle={confirmationButtonTitle}
          confirmationVariant={confirmationVariant}
          showDescription={showDescription}
          isDismissible={dismissible}
          onClosed={handleOnClosed}
          className={cn('max-w-xl', className)}
          title={title as string}
          tabs={tabs}
          description={description}
          footer={
            typeof footer === 'function'
              ? renderProps => {
                  const handleFooterEvents = (isCancel = false) => {
                    if (isCancel) {
                      // Bei Cancel verwende die Dialog-Close-Funktion (mit Bestätigung)
                      renderProps.close()
                      return
                    }
                    // Bei normalem Close (z.B. Submit) schließe direkt ohne Bestätigung
                    modalRef.current?.close()
                  }
                  return footer(handleFooterEvents)
                }
              : footer
          }
        >
          {children}
        </Dialog>
      )}
    </HeadlessModal>
  )
})
