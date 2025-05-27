import type React from 'react'
import { type ReactNode, useState } from 'react'
import { Button } from '@/Components/jolly-ui/button'

import { cn } from '@/Lib/utils'
import {
  DialogBody as JollyDialogBody,
  DialogContent as JollyDialogContent,
  DialogDescription as JollyDialogDescription,
  DialogFooter as JollyDialogFooter,
  DialogHeader as JollyDialogHeader,
  DialogOverlay as JollyDialogOverlay,
  DialogTitle as JollyDialogTitle
} from '@/Components/jolly-ui/dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { AlertDialog } from '@/Components/twcui/alert-dialog'
import { composeRenderProps } from 'react-aria-components'

type ReactNodeOrString = ReactNode | string

export interface DialogRenderProps {
  close: () => void;
}

interface DialogProps {
  children: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  footer: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  isOpen: boolean
  role?: 'alertdialog' | 'dialog',
  showDescription?: boolean
  title?: string
  header?: ReactNodeOrString
  confirmClose?: boolean
  confirmationTitle?: string
  confirmationMessage?: string
  confirmationButtonTitle?: string
  confirmationVariant?: 'default' | 'destructive'
  description?: string | ReactNodeOrString
  isDismissible?: boolean
  tabs?: React.ReactNode
  dismissible?: boolean
  footerClassName?: string
  className?: string
  bodyPadding?: boolean
  width?: 'default' | '4xl'
  hideHeader?: boolean
  backgroundClass?: 'accent' | 'sidebar' | 'background'
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  onInteractOutside?: (event: Event) => void
  onClosed?: () => void
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  footer,
  isOpen = false,
  confirmClose = false,
  showDescription = false,
  isDismissible = false,
  confirmationTitle = 'Änderungen verwerfen',
  confirmationVariant = 'default',
  confirmationButtonTitle='Verwerfen',
  confirmationMessage = 'Möchtest Du die Änderungen verwerfen?',
  title,
  role = 'dialog',
  description,
  bodyPadding = false,
  tabs,
  dismissible = false,
  className,
  onClose,
  width = 'default',
  footerClassName = '',
  hideHeader = false,
  backgroundClass = 'sidebar',
  onOpenChange,
  ...props
}) => {

  const bgClass = {
    accent: 'bg-accent/50',
    sidebar: 'bg-sidebar',
    background: 'bg-background'
  }[backgroundClass]

  const bodyClass = bodyPadding ? 'px-6' : ''

  function showDiscardChangesConfirmation (): Promise<boolean> {
    return AlertDialog.call({
      title: confirmationTitle,
      message: confirmationMessage,
      buttonTitle: confirmationButtonTitle,
      variant: confirmationVariant
    })
  }


  const widthClass = {
    default: 'max-w-xl',
    '4xl': 'max-w-4xl'
  }[width]

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(isOpen)

  const handleClose = async () => {
    // Return a promise that resolves when the dialog should be closed
    return new Promise<boolean>((resolve) => {
      if (confirmClose) {
        // First, make sure the main dialog is not closed immediately
        // by delaying the confirmation dialog slightly
        setTimeout(async () => {
          try {
            // Use the utility function to show the confirmation dialog
            const result = await showDiscardChangesConfirmation()

            // Only close the dialog if the user confirmed
            if (result) {
              setIsDialogOpen(false)
              resolve(true) // Resolve the promise with true to indicate the dialog was closed
            } else {
              setIsDialogOpen(true)
              resolve(false) // Resolve the promise with false to indicate the dialog was not closed
            }
          } catch (error) {
            console.error('Error in confirmation dialog:', error)
            resolve(false) // Resolve the promise with false in case of error
          }
        }, 100) // Small delay to ensure the main dialog doesn't close immediately
      } else {
        setIsDialogOpen(false)
        onClose?.()
        resolve(true) // Resolve the promise with true to indicate the dialog was closed
      }
    })
  }

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      const shouldClose = await handleClose()
      if (shouldClose) {
        props.onClosed?.()
      } else {
        setIsDialogOpen(true)
      }
    } else {
      setIsDialogOpen(true)
      onOpenChange?.(true)
    }
  }

  return (
    <JollyDialogOverlay
      isOpen={isDialogOpen}
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      onOpenChange={handleOpenChange}
    >
      <JollyDialogContent
        closeButton={false}
        className={cn('relative', widthClass, className)}
        onOpenChange={handleOpenChange}
        role={role}
        title={title}
        bgColor={bgClass}
      >
        {composeRenderProps(children, (children, providedRenderProps) => {
          // Create our own renderProps with a close function that respects the confirmation result
          const renderProps: DialogRenderProps = {
            close: () => {
              // Use handleClose to show confirmation if needed
              void handleClose()
              // The dialog will be closed by handleClose if confirmation is successful
            }
          }

          return (
            <>
              {!hideHeader && <JollyDialogHeader className={cn(bgClass, ' my-0 gap-y-0')}>
                <JollyDialogTitle>{title}</JollyDialogTitle>
                <AlertDialog.Root />

                <JollyDialogDescription
                  className={cn('', !showDescription ? 'sr-only' : '')}
                >
                  {description}
                </JollyDialogDescription>
              </JollyDialogHeader>
              }
              <Button variant="ghost" size="icon-xs" className="absolute right-2 top-2"
                      onClick={() => renderProps.close()}
              >
                <Cross2Icon className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
              <JollyDialogBody className={cn('my-0', 'bg-background py-3', bodyClass)}>
                {children}
              </JollyDialogBody>
              {!!footer && <JollyDialogFooter
                className={cn('px-6 py-3 flex items-center justify-end space-x-2', footerClassName, bgClass)}
              >
                {typeof footer === 'function' ? footer(renderProps) : footer}
              </JollyDialogFooter>}
            </>
          )
        })}
      </JollyDialogContent>
    </JollyDialogOverlay>
  )
}
