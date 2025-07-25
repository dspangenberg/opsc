import type * as React from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from "@/Components/ui/twc-ui/button"
import {
  Dialog
} from '@/Components/twcui/dialog'
import { Alert02Icon, HelpCircleIcon} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/Lib/utils'
import { Heading } from 'react-aria-components'

interface AlertDialogProps {
  title: string
  message: string
  variant?: 'default' | 'destructive'
  buttonTitle: string
  cancelButtonTitle?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * AlertDialog component that shows a modal dialog with a title, message, and buttons.
 * This is the internal component used by the AlertDialog.call method.
 */
const AlertDialogComponent: React.FC<AlertDialogProps> = ({
  title,
  message,
  buttonTitle,
  variant = "destructive",
  cancelButtonTitle = 'Abbrechen',
  onConfirm,
  onCancel
}) => (
  <Dialog
    isOpen={true}
    onClose={() => {
      // Add a small delay before resolving the promise
      setTimeout(() => {
        onCancel();
      }, 50);
    }}
    className="max-w-xl bg-white z-100"
    confirmClose={false}
    description={message}
    role="alertdialog"
    bodyPadding
    hideHeader={true}
    dismissible={true}
    title={title}
    footer={
      <div className="flex items-center justify-end space-x-2">
        <Button autoFocus variant="outline" onClick={() => {
          // Add a small delay before resolving the promise
          setTimeout(() => {
            onCancel();
          }, 50);
        }}>
          { cancelButtonTitle }
        </Button>
        <Button form="clientForm" variant={variant} onClick={() => {
          // Add a small delay before resolving the promise
          setTimeout(() => {
            onConfirm();
          }, 50);
        }}>
          {buttonTitle}
        </Button>
      </div>
    }
  >
    <div className="flex mt-6 rounded-t-lg">
      <div className="sm:flex sm:items-start">
        <div className={cn('mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10', variant === 'destructive' ? 'bg-destructive/20' : 'bg-primary/20')}>
        <HugeiconsIcon icon={variant === 'destructive' ? Alert02Icon : HelpCircleIcon} className={cn('size-6 stroke-2', variant === 'destructive' ? 'text-destructive' : 'text-primary')} />
        </div>
        <div className="my-3 sm:mt-0 sm:ml-4 text-left">
          <Heading slot="title" className="text-large font-semibold text-left text-foreground">
          { title }
          </Heading>
          <div className="mt-2">
            <p className="text-base text-gray-500">
              { message }
            </p>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
);

// Create a type for the parameters of the call method
interface AlertDialogCallParams {
  title: string
  message: string
  variant?: 'default' | 'destructive'
  buttonTitle: string
}

/**
 * AlertDialog is a utility for showing modal dialogs that return a Promise.
 * This is a modern replacement for the deprecated createCallable from react-call.
 */
export const AlertDialog = {
  /**
   * Shows an alert dialog and returns a Promise that resolves to true if the user confirmed,
   * or false if the user canceled or closed the dialog.
   *
   * @param params The parameters for the alert dialog
   * @returns A Promise that resolves to true if the user confirmed, false otherwise
   *
   * @example
   * ```tsx
   * const confirmed = await AlertDialog.call({
   *   title: 'Confirm Action',
   *   message: 'Are you sure you want to perform this action?',
   *   buttonTitle: 'Confirm',
   *   variant: 'default'
   * });
   *
   * if (confirmed) {
   *   // User confirmed the action
   * } else {
   *   // User canceled the action
   * }
   * ```
   */
  call: (params: AlertDialogCallParams): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      // Create a container element for the dialog
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Create a root using React 18's createRoot API
      const root = createRoot(container);

      // Function to clean up the container
      const cleanup = () => {
        // Unmount the component using React 18's API
        root.unmount();
        // Remove the container from the DOM
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      };

      // Render the AlertDialogComponent with callbacks to resolve the promise
      root.render(
        <AlertDialogComponent
          {...params}
          onConfirm={() => {
            cleanup();
            resolve(true);
          }}
          onCancel={() => {
            cleanup();
            resolve(false);
          }}
        />
      );

      // Set a timeout to automatically clean up the dialog if it's not closed
      setTimeout(() => {
        cleanup();
        resolve(false);
      }, 500000); // 500-second timeout as a safety measure
    });
  },

  // Add a Root component for compatibility with existing code
  Root: () => null
}
