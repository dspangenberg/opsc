import * as React from 'react'
import { AlertDialog } from '@/Components/twcui/alert-dialog'

/**
 * A mutable ref object with a current property.
 * This is a replacement for the deprecated React.MutableRefObject.
 */
export interface MutableRef<T> {
  current: T
}

/**
 * Shows a confirmation dialog asking if the user wants to discard changes.
 *
 * @returns A Promise that resolves to true if the user confirmed, false otherwise
 */
export async function showDiscardChangesConfirmation (): Promise<boolean> {
  return AlertDialog.call({
    title: 'Änderungen verwerfen',
    message: 'Möchtest Du die Änderungen verwerfen?',
    buttonTitle: 'Verwerfen',
    variant: 'default'
  })
}

/**
 * Type definition for the closeRef used in dialog components.
 * This provides a consistent interface for both dialog implementations.
 */
export type DialogCloseRef = {
  (): Promise<boolean>
  showConfirmation?: () => Promise<boolean>
} | null

/**
 * Sets up a closeRef for a dialog component.
 * This function handles the common logic for both dialog implementations.
 *
 * @param closeRef The ref object to set up
 * @param closeFunction The function to call when the dialog should be closed
 * @param showConfirmation Optional function to show a confirmation dialog without closing
 */
export function setupDialogCloseRef (
  closeRef: MutableRef<DialogCloseRef> | undefined,
  closeFunction: () => Promise<boolean>,
  showConfirmation?: () => Promise<boolean>
): void {
  React.useEffect(() => {
    if (closeRef && closeRef.current === null) {
      // Create a function that calls the provided closeFunction
      const closeFn = async () => {
        return closeFunction()
      }

      // Add the showConfirmation method if provided
      if (showConfirmation) {
        closeFn.showConfirmation = showConfirmation
      }

      // Set closeRef.current to the closeFn
      closeRef.current = closeFn
    }
  }, [closeRef, closeFunction, showConfirmation])
}
