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

export type ReactNodeOrString = ReactNode | string

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
          : 'entering:fade-in-0 exiting:fade-out-0 entering:zoom-in-95 exiting:zoom-out-95 fixed top-[50%] left-[50vw] z-50 max-h-screen w-full max-w-lg -translate-x-1/2 -translate-y-1/2 entering:animate-in exiting:animate-out border bg-background shadow-lg duration-200 exiting:duration-300 sm:rounded-lg md:w-full',
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
  <AriaHeading slot="title" className={cn('py-3 font-medium text-lg!', className)} {...props} />
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

export interface DialogProps {
  children: React.ReactNode
  isOpen?: boolean
  isDismissible?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  onClosed?: () => void
  onBeforeClose?: () => Promise<boolean> | boolean
  /**
   * @internal - Used by ConfirmableDialog/AlertDialog to prevent automatic DialogContent wrapping
   */
  _skipContentWrapper?: boolean
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  isOpen = undefined,
  isDismissible = true,
  onOpenChange,
  onClose,
  onClosed,
  onBeforeClose,
  _skipContentWrapper = false
}) => {
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
    // Call onBeforeClose if provided
    if (onBeforeClose) {
      const shouldClose = await onBeforeClose()
      if (!shouldClose) {
        return false
      }
    }

    if (isControlled) {
      onOpenChange?.(false)
    } else {
      setInternalOpen(false)
    }
    onClose?.()
    onClosed?.()
    return true
  }

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      await handleClose()
    } else {
      if (isControlled) {
        onOpenChange?.(true)
      } else {
        setInternalOpen(true)
      }
    }
  }

  const content = _skipContentWrapper ? (
    children
  ) : (
    <DialogContent closeButton={false}>{children}</DialogContent>
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
