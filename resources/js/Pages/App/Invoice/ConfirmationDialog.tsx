import { createCallable } from 'react-call'
import type * as React from 'react'
import { Button } from '@dspangenberg/twcui'
import { ResponsiveDialog } from '@/Components/ResponsiveDialog'
import { Alert02Icon} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
interface Props {
  title: string
  message: string
  buttonTitle: string
}

export const ConfirmationDialog = createCallable<Props, boolean>(
  ({ call, title, message, buttonTitle }) => (
    <ResponsiveDialog
      isOpen={true}
      onClose={() => call.end(false)}
      className="max-w-xl bg-white"
      description={message}
      hideHeader={true}
      dismissible={true}
      title={title}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={() => call.end(false)}>
            Abbrechen
          </Button>
          <Button form="clientForm" variant="destructive" onClick={() => call.end(true)}>
            {buttonTitle}
          </Button>
        </div>
      }
    >
      <div className="flex my-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
          <HugeiconsIcon icon={Alert02Icon} className="size-6 text-red-600 stroke-2" />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
            <h3 className="text-large font-semibold text-lefttext-gray-900">
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
    </ResponsiveDialog>
  ),
  500
)
