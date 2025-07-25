/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Dialog } from '@/Components/twcui/dialog'
import { cn } from '@/Lib/utils'
import { HeadlessModal, type HeadlessModalProps } from '@inertiaui/modal-react'
import type { ReactNode, RefObject } from 'react'
import type React from 'react'
import { forwardRef, useRef } from 'react'

type ReactNodeOrString = ReactNode | string

export interface Props {
  children: ReactNode
  footer: ((handleFooterEvents?: (isCancel?: boolean) => void) => ReactNode) | ReactNode
  title: string
  description?: ReactNodeOrString
  dismissible?: boolean
  showDescription?: boolean
  className?: string
  tabs?: React.ReactNode
  ref: RefObject<Props>
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  onInteractOutside?: (event: Event) => void
}

export const InertiaDialog = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    children,
    footer,
    title,
    tabs,
    description,
    dismissible = true,
    showDescription = false,
    onInteractOutside,
    className,
    onClose
  } = props
  const modalRef = useRef<HeadlessModalProps>(null)

  const handleInteractOutside = (event: Event) => {
    if (!dismissible) {
      event.preventDefault()
      return
    }

    if (onInteractOutside) {
      onInteractOutside(event)
    } else if (dismissible) {
      if (onClose) {
        onClose()
      }
    }
  }

  const handleFooterEvents = (isCancel = false) => {
    if (isCancel) {
      handleOpenChange(false)
      return
    }
    modalRef.current?.close()
  }

  const handleOpenChange = (open: boolean) => {
    if (!dismissible) {
      return
    }
    if (!open && onClose) {
      onClose()
    }
  }

  return (
    <HeadlessModal ref={modalRef} {...props}>
      {({ isOpen, setOpen, close }: HeadlessModalProps) => (
        <Dialog
          isOpen={isOpen}
          onClose={() => setOpen(false)}
          onInteractOutside={handleInteractOutside}
          onClosed={close}
          onOpenChange={handleOpenChange}
          isDismissable={false}
          showDescription={showDescription}
          dismissible={dismissible}
          className={cn('max-w-xl', className)}
          title={title}
          tabs={tabs}
          description={description}
          footer={typeof footer === 'function' ? footer(handleFooterEvents) : footer}
        >
          {children}
        </Dialog>
      )}
    </HeadlessModal>
  )
})
