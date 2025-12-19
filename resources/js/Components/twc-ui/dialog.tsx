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
        'exiting:fade-out-0 exiting:animate-out exiting:duration-300',
        /* Entering */
        'entering:fade-in-0 entering:animate-in',
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
          : '-translate-x-1/2 -translate-y-1/2 entering:fade-in-0 exiting:fade-out-0 entering:zoom-in-95 exiting:zoom-out-95 fixed top-[50%] left-[50vw] z-50 max-h-screen w-full max-w-lg entering:animate-in exiting:animate-out border bg-background shadow-lg duration-200 exiting:duration-300 sm:rounded-lg md:w-full',
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
              className="absolute top-3 right-4 rounded-sm entering:bg-accent entering:text-muted-foreground opacity-70 ring-offset-background backdrop-blur-lg transition-opacity data-disabled:pointer-events-none data-hovered:opacity-100 data-focused:outline-none data-focused:ring-2 data-focused:ring-ring data-focused:ring-offset-2"
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
      'flex flex-col items-center justify-center gap-0 rounded-t-lg bg-muted/80! px-4 text-center sm:text-left',
      className
    )}
    {...props}
  />
)

export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse rounded-b-lg bg-muted/40! px-4 py-4 sm:flex-row sm:justify-end sm:space-x-2',
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
  <AriaHeading slot="title" className={cn('py-3 font-medium', className)} {...props} />
)

export const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('flex flex-col text-center text-sm sm:text-left', className)} {...props} />
)

export interface DialogRenderProps {
  close: () => void
}

interface DialogProps {
  children: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  footer?: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
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
  description?: ReactNodeOrString
  isDismissible?: boolean
  bodyClass?: string
  footerClassName?: string
  className?: string
  bodyPadding?: boolean
  width?: 'default' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'md' | 'lg'
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
  isOpen = undefined,
  confirmClose = false,
  showDescription = false,
  isDismissible = true,
  confirmationTitle = 'Änderungen verwerfen',
  confirmationVariant = 'default',
  confirmationButtonTitle = 'Verwerfen',
  confirmationMessage = 'Möchtest Du die Änderungen verwerfen?',
  title = 'Dialog',
  role = 'dialog',
  description,
  bodyPadding = false,
  bodyClass,
  className,
  onClose,
  width = 'default',
  footerClassName = '',
  hideHeader = false,
  background = 'page',
  onOpenChange,
  onClosed
}) => {
  const bgClass = {
    accent: 'bg-accent',
    sidebar: 'bg-sidebar',
    background: 'bg-background',
    page: 'bg-page-content'
  }[background]

  const widthClass = {
    default: 'max-w-xl',
    md: 'max-w-md',
    lg: 'max-w-lg',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-6xl',
    '6xl': 'max-w-5xl'
  }[width]

  // Determine if this is controlled (used standalone) or uncontrolled (used with DialogTrigger)
  const isControlled = isOpen !== undefined
  const [internalOpen, setInternalOpen] = useState<boolean>(isOpen ?? false)

  const currentOpen = isControlled ? isOpen : internalOpen

  useEffect(() => {
    if (isControlled) {
      setInternalOpen(isOpen)
    }
  }, [isOpen, isControlled])

  const handleClose = async () => {
    return new Promise<boolean>(resolve => {
      if (confirmClose) {
        setTimeout(async () => {
          try {
            const result = await AlertDialog.call({
              title: confirmationTitle,
              message: confirmationMessage,
              buttonTitle: confirmationButtonTitle,
              variant: confirmationVariant
            })

            if (result) {
              if (isControlled) {
                onOpenChange?.(false)
              } else {
                setInternalOpen(false)
              }
              onClose?.()
              onClosed?.()
              resolve(true)
            } else {
              if (isControlled) {
                onOpenChange?.(true)
              } else {
                setInternalOpen(true)
              }
              resolve(false)
            }
          } catch (error) {
            console.error('Error in confirmation dialog:', error)
            resolve(false)
          }
        }, 100)
      } else {
        if (isControlled) {
          onOpenChange?.(false)
        } else {
          setInternalOpen(false)
        }
        onClose?.()
        onClosed?.()
        resolve(true)
      }
    })
  }

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      const shouldClose = await handleClose()
      if (!shouldClose) {
        if (isControlled) {
          onOpenChange?.(true)
        } else {
          setInternalOpen(true)
        }
      }
    } else {
      if (isControlled) {
        onOpenChange?.(true)
      } else {
        setInternalOpen(true)
      }
    }
  }

  // Content to render
  const content = (
    <DialogContent
      closeButton={false}
      className={cn(
        'relative flex w-full flex-col gap-0 space-y-0 rounded-lg',
        widthClass,
        className
      )}
      role={role}
    >
      {composeRenderProps(children, (children, providedRenderProps) => {
        const renderProps: DialogRenderProps = {
          close: () => {
            if (isControlled) {
              void handleClose()
            } else {
              providedRenderProps.close()
            }
          }
        }

        return (
          <>
            {!hideHeader && (
              <DialogHeader
                className={cn(
                  'relative my-0 flex w-full flex-1 flex-col justify-stretch gap-0 px-0 py-0'
                )}
              >
                {isDismissible && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-0.5 right-1.5 flex-1"
                    icon={X}
                    aria-label="Close"
                    onClick={() => renderProps.close()}
                  />
                )}
                <DialogTitle className="flex flex-1 items-center justify-between py-1.5! text-left text-base leading-0! md:text-center">
                  <span className="text-base">{title}</span>
                </DialogTitle>
                <DialogDescription className={cn('', !showDescription ? 'sr-only py-0' : '')}>
                  {description}
                </DialogDescription>
              </DialogHeader>
            )}

            <DialogBody
              className={cn(
                'mx-0 my-0 flex flex-1 flex-col px-0',
                'overflow-y-auto',
                bgClass,
                hideHeader ? 'rounded-lg' : '',
                bodyClass,
                bodyPadding ? 'px-4' : ''
              )}
            >
              {children}
            </DialogBody>
            {!!footer && (
              <DialogFooter
                className={cn(
                  'flex flex-justify-end flex-none items-center space-x-2 px-4 py-3',
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
  )

  if (isControlled) {
    return (
      <DialogOverlay
        isOpen={currentOpen}
        isDismissable={isDismissible}
        isKeyboardDismissDisabled={!isDismissible}
        onOpenChange={handleOpenChange}
      >
        {content}
      </DialogOverlay>
    )
  }

  return (
    <DialogOverlay isDismissable={isDismissible} isKeyboardDismissDisabled={!isDismissible}>
      {content}
    </DialogOverlay>
  )
}

export { DialogTrigger }
