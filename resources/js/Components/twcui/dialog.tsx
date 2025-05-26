import type React from 'react'
import { type ReactNode, useState, useEffect, useRef } from 'react'
import { Button } from '@/Components/jolly-ui/button'

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
import { Cross2Icon } from '@radix-ui/react-icons'
import { AlertDialog } from '@/Components/twcui/alert-dialog'
import { composeRenderProps } from 'react-aria-components'

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
  title?: string
  header?: ReactNodeOrString
  confirmClose?: boolean
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
  /**
   * Ref object to expose methods to parent components.
   * Parent components can use this ref to programmatically interact with the dialog.
   *
   * The ref exposes the following methods:
   * - `closeRef.current()`: Attempts to close the dialog, showing a confirmation dialog if `confirmClose` is true.
   *   Returns a Promise that resolves to `true` if the dialog was closed, or `false` if the user cancelled.
   * - `closeRef.current.showConfirmation()`: Shows the confirmation dialog without closing the dialog.
   *   Returns a Promise that resolves to `true` if the user confirmed, or `false` if the user cancelled.
   *   This is useful when you want to show the confirmation dialog but handle the closing logic yourself.
   *
   * @example
   * ```tsx
   * const dialogRef = useRef<{
   *   (): Promise<boolean>;
   *   showConfirmation?: () => Promise<boolean>;
   * } | null>(null);
   *
   * // Later in your component
   * <button onClick={async () => {
   *   // Show confirmation dialog without closing
   *   const confirmed = await dialogRef.current?.showConfirmation?.();
   *   if (confirmed) {
   *     // Handle confirmation (e.g., save data, navigate away, etc.)
   *   }
   * }}>Show Confirmation</button>
   *
   * <button onClick={async () => {
   *   // Close dialog with confirmation
   *   const closed = await dialogRef.current?.();
   *   if (closed) {
   *     // Dialog was closed
   *   }
   * }}>Close Dialog</button>
   *
   * <Dialog closeRef={dialogRef}>
   *   Dialog content
   * </Dialog>
   * ```
   */
  closeRef?: React.MutableRefObject<{
    (): Promise<boolean>;
    showConfirmation?: () => Promise<boolean>;
  } | null>
}

export const Dialog: React.FC<DialogProps> = ({
  children,
  footer,
  isOpen = false,
  confirmClose = false,
  showDescription = false,
  isDismissible = false,
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
  closeRef
}) => {

  const bgClass = {
    accent: 'bg-accent/50',
    sidebar: 'bg-sidebar',
    background: 'bg-background'
  }[backgroundClass]

  const bodyClass = bodyPadding ? 'px-6' : ''

  const widthClass = {
    default: 'max-w-xl',
    '4xl': 'max-w-4xl'
  }[width]

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(isOpen)
  // Use the closeRef passed as a prop instead of creating a local one

  // Function to show the confirmation dialog without closing the dialog
  const showConfirmation = async () => {
    // Return a promise that resolves with the user's confirmation choice
    return new Promise<boolean>((resolve) => {
      if (confirmClose) {
        // Show the confirmation dialog with a small delay to ensure it's visible
        setTimeout(() => {
          AlertDialog.call({
            title: 'Änderungen verwerfen',
            message: 'Möchtest Du die Änderungen verwerfen?',
            buttonTitle: 'Verwerfen',
            variant: "default"
          })
          .then(result => {
            // Resolve with the user's choice (true if confirmed, false if cancelled)
            resolve(result === true);
          })
          .catch(error => {
            console.error("Error in confirmation dialog:", error);
            resolve(false); // Resolve with false in case of error
          });
        }, 100);
      } else {
        // If confirmClose is false, resolve with true immediately (no confirmation needed)
        resolve(true);
      }
    });
  };

  const handleClose = async () => {
    // Return a promise that resolves when the dialog should be closed
    return new Promise<boolean>((resolve) => {
      if (confirmClose) {
        // First, make sure the main dialog is not closed immediately
        // by delaying the confirmation dialog slightly
        setTimeout(() => {
          // Show the confirmation dialog and wait for the result
          AlertDialog.call({
            title: 'Änderungen verwerfen',
            message: 'Möchtest Du die Änderungen verwerfen?',
            buttonTitle: 'Verwerfen',
            variant: "default"
          })
          .then(result => {
            // Only close the dialog if the user confirmed
            if (result === true) {
              setIsDialogOpen(false);
              onOpenChange?.(false);
              onClose?.();
              resolve(true); // Resolve the promise with true to indicate the dialog was closed
            } else {
              resolve(false); // Resolve the promise with false to indicate the dialog was not closed
            }
          })
          .catch(error => {
            console.error("Error in confirmation dialog:", error);
            resolve(false); // Resolve the promise with false in case of error
          });
        }, 100); // Small delay to ensure the main dialog doesn't close immediately
      } else {
        setIsDialogOpen(false);
        onOpenChange?.(false);
        onClose?.();
        resolve(true); // Resolve the promise with true to indicate the dialog was closed
      }
    });
  };

  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      // When closing the dialog, call handleClose and let it handle the confirmation
      // This will prevent the dialog from closing immediately
      const shouldClose = await handleClose();
      // If handleClose returns false, it means the user cancelled the confirmation dialog
      // In this case, we don't need to do anything else, as the dialog will remain open
      // If handleClose returns true, it means the dialog was closed, and we've already
      // called setIsDialogOpen(false) and onOpenChange?.(false) in handleClose
    } else {
      setIsDialogOpen(true);
      onOpenChange?.(true);
    }
  };

  useEffect(() => {
    if (closeRef && closeRef.current === null) {
      // Create a function that calls handleClose
      const closeFunction = async () => {
        // We need to make sure the confirmation dialog is shown before the main dialog closes
        // So we'll return a promise that resolves when the confirmation dialog is handled
        return new Promise<boolean>((resolve) => {
          try {
            // Call handleClose and wait for the result
            handleClose().then(shouldClose => {
              // Return the result to the caller
              resolve(shouldClose);
            }).catch(error => {
              console.error("Error in closeRef.current:", error);
              resolve(false);
            });
          } catch (error) {
            console.error("Error in closeRef.current:", error);
            resolve(false);
          }
        });
      };

      // Add the showConfirmation method to the closeFunction
      closeFunction.showConfirmation = showConfirmation;

      // Set closeRef.current to the closeFunction
      closeRef.current = closeFunction;
    }
  }, [closeRef, handleClose, showConfirmation]);


  return (
    <JollyDialogOverlay
      isOpen={isDialogOpen}
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      onOpenChange={handleOpenChange}
    >  <JollyDialogContent
      closeButton={false}
      className={cn('relative', widthClass, className)}
      onOpenChange={handleOpenChange}
      role={role}
      title={title}
      closeRef={closeRef}  // Hier weitergeben
      bgColor={bgClass}
    >
      {composeRenderProps(children, (children, renderProps) => {
        // closeRef is now handled in useEffect
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
            <Button variant="ghost" size="icon-xs" className="absolute right-2 top-2" onClick={async () => {
              await handleClose();
            }}>
              <Cross2Icon className="size-4" />
              <span className="sr-only">Close</span>
            </Button>
            <JollyDialogBody className={cn('my-0','bg-background py-3', bodyClass)}>
              {children}
            </JollyDialogBody>
            {!!footer && <JollyDialogFooter className={cn('px-6 py-3 flex items-center justify-end space-x-2', footerClassName, bgClass)}>
              {footer}
            </JollyDialogFooter>}
          </>
        );
      })}
    </JollyDialogContent>
    </JollyDialogOverlay>
  )
}
