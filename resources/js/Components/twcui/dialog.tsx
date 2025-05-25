import type React from 'react'
import { type ReactNode, useState } from 'react'

import { cn } from '@/Lib/utils'
import {
  DialogContentProps,
  DialogBody as JollyDialogBody,
  DialogContent as JollyDialogContent,
  DialogDescription as JollyDialogDescription,
  DialogFooter as JollyDialogFooter,
  DialogHeader as JollyDialogHeader,
  DialogOverlay as JollyDialogOverlay,
  DialogTitle as JollyDialogTitle
} from '@/Components/jolly-ui/dialog'

type ReactNodeOrString = ReactNode | string

/**
 * Props for the Dialog component.
 *
 * To enable confirmation before closing the dialog, set `confirmClose` to true and provide an `onConfirmClose` function.
 * The `onConfirmClose` function should return a boolean:
 * - Return true to allow the dialog to close
 * - Return false to prevent the dialog from closing
 *
 * If `confirmClose` is true but no `onConfirmClose` function is provided, the dialog will not close when the user
 * attempts to close it by clicking outside or pressing Escape.
 */
interface DialogProps {
  children: React.ReactNode
  footer: React.ReactNode
  isOpen: boolean
  role?: 'alertdialog' | 'dialog',
  showDescription?: boolean
  title?: ReactNodeOrString
  header?: ReactNodeOrString
  confirmClose?: boolean
  onConfirmClose?: () => boolean
  description?: string | ReactNodeOrString
  tabs?: React.ReactNode
  dismissible?: boolean
  className?: string
  bodyPadding?: boolean
  onClose: () => void
  width?: 'default' | '4xl'
  hideHeader?: boolean
  backgroundClass?: 'accent' | 'sidebar' | 'background'
  onOpenChange?: (open: boolean) => void
  onInteractOutside?: (event: Event) => void
  onEscapeKeyDown?: (event: React.KeyboardEvent) => void
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  footer,
  isOpen = false,
  confirmClose = false,
  onConfirmClose,
  showDescription = false,
  title,
  role = 'dialog',
  description,
  bodyPadding = false,
  tabs,
  dismissible = false,
  className,
  width = 'default',
  hideHeader = false,
  backgroundClass = 'accent',
  onOpenChange,
  onClose,
  onInteractOutside,
  onEscapeKeyDown
}) => {

  const bgClass = {
    accent: 'bg-accent/50',
    sidebar: 'bg-sidebar',
    background: 'bg-background'
  }[backgroundClass]

  const bodyClass = bodyPadding ? 'p-4' : ''

  const widthClass = {
    default: 'w-full max-w-md',
    '4xl': 'w-4xl min-w-4xl'
  }[width]

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(isOpen)

  const handleClose = () => {
    if (confirmClose) {
      // If onConfirmClose is provided, call it and only close if it returns true
      // If onConfirmClose is not provided, don't close the dialog (default behavior)
      if (onConfirmClose?.()) {
        setIsDialogOpen(false)
        onClose()
      }
    } else {
      setIsDialogOpen(false)
      onClose()
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
  }

  return (
    <JollyDialogOverlay
      isOpen={isDialogOpen}
      onOpenChange={handleClose}
      isDismissable={dismissible}
      isKeyboardDismissDisabled={dismissible}
    >
      <JollyDialogContent className={cn(className)} role={role} onOpenChange={handleOpenChange}>
        {!hideHeader && <JollyDialogHeader className={cn(widthClass, bgClass)}>
          <JollyDialogTitle>{title}</JollyDialogTitle>

          <JollyDialogDescription
            className={cn('', !showDescription ? 'sr-only' : '')}
          >
            {description}
          </JollyDialogDescription>
        </JollyDialogHeader>
        }
        <JollyDialogBody className={bodyClass}>
          {children}
        </JollyDialogBody>
        {!!footer && <JollyDialogFooter className={bgClass}>
          {footer}
        </JollyDialogFooter>}
      </JollyDialogContent>
    </JollyDialogOverlay>
  )
}
