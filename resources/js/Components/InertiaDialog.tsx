/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { cn } from '@/Lib/utils'
// import { HeadlessModal, type HeadlessModalProps } from '@inertiaui/modal-react' // Temporarily disabled
import type { ReactNode, RefObject } from 'react'
import type React from 'react'
import { forwardRef, useRef, useState } from 'react'

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
  
  // Temporarily use simple state instead of HeadlessModal
  const [isOpen, setIsOpen] = useState(true)

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
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!dismissible) {
      return
    }
    setIsOpen(open)
    if (!open && onClose) {
      onClose()
    }
  }

  // Temporarily return a simple dialog without HeadlessModal wrapper
  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => handleOpenChange(false)}
      onInteractOutside={handleInteractOutside}
      onClosed={() => setIsOpen(false)}
      onOpenChange={handleOpenChange}
      isDismissible={dismissible}
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
  )
})
