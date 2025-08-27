import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import type React from 'react'
import { type ReactNode, useEffect, useState } from 'react'
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  type HeadingProps as AriaHeadingProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
  composeRenderProps
} from 'react-aria-components'
import { cn } from '@/Lib/utils'

import { AlertDialog } from './alert-dialog'
import { Button } from './button'

type ReactNodeOrString = ReactNode | string

const sheetVariants = cva(
  [
    'fixed z-50 gap-4 bg-background shadow-lg transition ease-in-out ',
    /* Entering */
    'data-[entering]:duration-500 data-[entering]:animate-in',
    /* Exiting */
    'data-[exiting]:duration-300  data-[exiting]:animate-out'
  ],
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[entering]:slide-in-from-top data-[exiting]:slide-out-to-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[entering]:slide-in-from-bottom data-[exiting]:slide-out-to-bottom rounded-t-lg max-h-3/4',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4  border-l data-[entering]:slide-in-from-right data-[exiting]:slide-out-to-right sm:max-w-sm'
      }
    }
  }
)

const DialogTrigger = AriaDialogTrigger

export const DialogOverlay = ({
  className,
  isDismissable = true,
  ...props
}: AriaModalOverlayProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, className =>
      cn(
        'fixed inset-0 z-50 bg-black/80',
        /* Exiting */
        'data-[exiting]:fade-out-0 data-[exiting]:animate-out data-[exiting]:duration-300',
        /* Entering */
        'data-[entering]:fade-in-0 data-[entering]:animate-in',
        className
      )
    )}
    {...props}
  />
)

interface DialogContentProps
  extends Omit<React.ComponentProps<typeof AriaModal>, 'children'>,
    VariantProps<typeof sheetVariants> {
  children?: AriaDialogProps['children']
  role?: AriaDialogProps['role']
  closeButton?: boolean
}

export const DialogContent = ({
  className,
  children,
  side,
  role,
  closeButton = true,
  ...props
}: DialogContentProps) => (
  <AriaModal
    className={composeRenderProps(className, className =>
      cn(
        side
          ? sheetVariants({
              side,
              className: 'h-full'
            })
          : '-translate-x-1/2 -translate-y-1/2 data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 fixed top-[50%] left-[50vw] z-50 max-h-screen w-full max-w-lg border bg-background shadow-lg duration-200 data-[entering]:animate-in data-[exiting]:animate-out data-[exiting]:duration-300 sm:rounded-lg md:w-full',
        className
      )
    )}
    {...props}
  >
    <AriaDialog role={role} className={cn(!side && 'grid h-full', 'h-full outline-none')}>
      {composeRenderProps(children, (children, renderProps) => (
        <>
          {children}
          {closeButton && (
            <AriaButton
              onPress={renderProps.close}
              className="absolute top-3 right-4 rounded-sm opacity-70 ring-offset-background backdrop-blur-lg transition-opacity data-[disabled]:pointer-events-none data-[entering]:bg-accent data-[entering]:text-muted-foreground data-[hovered]:opacity-100 data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </AriaButton>
          )}
        </>
      ))}
    </AriaDialog>
  </AriaModal>
)

export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      '!bg-muted/80 flex flex-col items-center justify-center gap-0 rounded-t-lg px-4 text-center sm:text-left',
      className
    )}
    {...props}
  />
)

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      '!bg-muted/40 flex flex-col-reverse rounded-b-lg px-4 py-4 sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)

export const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex w-full flex-col-reverse px-0 py-0 sm:flex-row sm:space-x-2', className)}
    {...props}
  />
)

export const DialogTitle = ({ className, ...props }: AriaHeadingProps) => (
  <AriaHeading slot="title" className={cn('font-medium', className)} {...props} />
)

export const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('flex flex-col border text-center sm:text-left', className)} {...props} />
)

export interface DialogRenderProps {
  close: () => void
}

interface DialogProps {
  children: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  footer?: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  toolbar?: React.ReactNode
  isOpen?: boolean
  role?: 'alertdialog' | 'dialog'
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
  width?: 'default' | '2xl' | '4xl' | '5xl' | '6xl'
  hideHeader?: boolean
  background?: 'accent' | 'sidebar' | 'background' | 'page'
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
  confirmationButtonTitle = 'Verwerfen',
  confirmationMessage = 'Möchtest Du die Änderungen verwerfen?',
  title = 'Dialog',
  role = 'dialog',
  description,
  bodyPadding = false,
  tabs,
  dismissible = false,
  toolbar = null,
  className,
  onClose,
  width = 'default',
  footerClassName = '',
  hideHeader = false,
  background = 'page',
  onOpenChange,
  onClosed,
  ...props
}) => {
  const bgClass = {
    accent: 'bg-accent/50',
    sidebar: 'bg-sidebar',
    background: 'bg-background',
    page: 'bg-page-content'
  }[background]

  const bodyClass = bodyPadding ? 'px-4' : ''

  const widthClass = {
    default: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-6xl',
    '6xl': 'max-w-5xl'
  }[width]

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(isOpen)

  useEffect(() => {
    setIsDialogOpen(isOpen)
  }, [isOpen])

  const handleClose = async () => {
    // Return a promise that resolves when the dialog should be closed
    return new Promise<boolean>(resolve => {
      if (confirmClose) {
        // First, make sure the main dialog is not closed immediately
        // by delaying the confirmation dialog slightly
        setTimeout(async () => {
          try {
            // Use the utility function to show the confirmation dialog
            const result = await AlertDialog.call({
              title: confirmationTitle,
              message: confirmationMessage,
              buttonTitle: confirmationButtonTitle,
              variant: confirmationVariant
            })

            // Only close the dialog if the user confirmed
            if (result) {
              setIsDialogOpen(false)
              onOpenChange?.(false) // Notify parent component that dialog is closed
              onClose?.()
              onClosed?.() // Fire onClosed callback
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
        onClosed?.() // Fire onClosed callback
        onOpenChange?.(false) // Notify parent component that dialog is closed
        resolve(true) // Resolve the promise with true to indicate the dialog was closed
      }
    })
  }

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      const shouldClose = await handleClose()
      if (shouldClose) {
        // onClosed is already called in handleClose, no need to call it again here
        // No need to call onOpenChange(false) here as it's already called in handleClose
      } else {
        setIsDialogOpen(true)
      }
    } else {
      setIsDialogOpen(true)
      onOpenChange?.(true)
    }
  }

  return (
    <DialogOverlay
      isOpen={isDialogOpen}
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        closeButton={false}
        className={cn('relative gap-0 space-y-0 rounded-lg', widthClass, className)}
        role={role}
      >
        {composeRenderProps(children, (children, _providedRenderProps) => {
          const renderProps: DialogRenderProps = {
            close: () => {
              // Use handleClose to show confirmation if needed
              void handleClose()
              // The dialog will be closed by handleClose if confirmation is successful
            }
          }

          return (
            <>
              {!hideHeader && (
                <DialogHeader className={cn('my-0 flex flex-1 flex-col gap-0 px-3 py-0', bgClass)}>
                  <DialogTitle className="!py-1.5 !leading-0 flex w-full items-center justify-between text-left text-base md:text-center">
                    <span className="flex-1 text-base">{title}</span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      icon={X}
                      aria-label="Close"
                      onClick={() => renderProps.close()}
                    />
                  </DialogTitle>

                  <DialogDescription className={cn('', !showDescription ? 'sr-only py-0' : '')}>
                    {description}
                  </DialogDescription>
                </DialogHeader>
              )}

              <DialogBody
                className={cn(
                  'mx-0 my-0 flex w-full flex-col px-0',
                  'bg-background',
                  hideHeader ? 'rounded-lg' : '',
                  bodyClass
                )}
              >
                {children}
              </DialogBody>
              {!!footer && (
                <DialogFooter
                  className={cn(
                    'flex items-center justify-end space-x-2 px-4 py-3',
                    footerClassName,
                    bgClass
                  )}
                >
                  {typeof footer === 'function' ? footer(renderProps) : footer}
                </DialogFooter>
              )}
            </>
          )
        })}
      </DialogContent>
    </DialogOverlay>
  )
}
