import { createCallable } from 'react-call'
import type * as React from 'react'
import { Button } from '@/Components/jolly-ui/button'
import {
  Dialog
} from '@/Components/twcui/dialog'
import { Alert02Icon, HelpCircleIcon} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/Lib/utils'
interface Props {
  title: string
  message: string
  variant?: 'default' | 'destructive'
  buttonTitle: string
}

export const AlertDialog = createCallable<Props, boolean>(
  ({ call, title, message, buttonTitle, variant="destructive" }) => (
    <Dialog
      isOpen={true}
      onClose={() => {
        // Add a small delay before resolving the promise
        setTimeout(() => {
          call.end(false);
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
              call.end(false);
            }, 50);
          }}>
            Abbrechen
          </Button>
          <Button form="clientForm" variant={variant} onClick={() => {
            // Add a small delay before resolving the promise
            setTimeout(() => {
              call.end(true);
            }, 50);
          }}>
            {buttonTitle}
          </Button>
        </div>
      }
    >
      <div className="flex pt-3">
        <div className="sm:flex sm:items-start">
          <div className={cn('mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10', variant === 'destructive' ? 'bg-destructive/20' : 'bg-primary/20')}>
          <HugeiconsIcon icon={variant === 'destructive' ? Alert02Icon : HelpCircleIcon} className={cn('size-6 stroke-2', variant === 'destructive' ? 'text-destructive' : 'text-primary')} />
          </div>
          <div className="my-3 sm:mt-0 sm:ml-4 text-left">
            <h3 className="text-large font-semibold text-left text-foreground">
              { title }
            </h3>
            <div className="mt-2">
              <p className="text-base text-gray-500">
                { message }
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  ),
  500
)
