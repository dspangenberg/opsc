import { cn } from '@/Lib/utils'
import { Alert02Icon, HelpCircleIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { Heading } from 'react-aria-components'
import { createRoot } from 'react-dom/client'
import { Button } from './button'
import { Dialog } from './dialog'
import { Icon } from './icon'

type AlertDialogVariant = 'default' | 'destructive' | 'info'

interface AlertDialogProps {
  title: string
  message: string
  variant?: AlertDialogVariant
  buttonTitle?: string
  cancelButtonTitle?: string
  onConfirm: () => void
  onCancel: () => void
}

const AlertDialogComponent: React.FC<AlertDialogProps> = ({
  title,
  message,
  buttonTitle = 'OK',
  variant = 'destructive',
  cancelButtonTitle = 'Abbrechen',
  onConfirm,
  onCancel
}) => {
  const icon =
    variant === 'destructive'
      ? Alert02Icon
      : variant === 'info'
        ? InformationCircleIcon
        : HelpCircleIcon

  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100 max-w-xl bg-white"
      confirmClose={false}
      description={message}
      role="alertdialog"
      bodyPadding
      hideHeader={true}
      dismissible={true}
      title={title}
      footer={
        <div className="flex items-center justify-end space-x-2">
          {variant !== 'info' && (
            <Button
              autoFocus
              variant="outline"
              onClick={() => {
                setTimeout(() => {
                  onCancel()
                }, 50)
              }}
            >
              {cancelButtonTitle}
            </Button>
          )}
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              setTimeout(() => {
                onConfirm()
              }, 50)
            }}
          >
            {buttonTitle}
          </Button>
        </div>
      }
    >
      <div className="mt-6 flex rounded-t-lg">
        <div className="sm:flex sm:items-start">
          <div
            className={cn(
              'mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10',
              variant === 'destructive' ? 'bg-destructive/20' : 'bg-primary/20'
            )}
          >
            <Icon
              icon={icon}
              className={cn(
                'size-6 stroke-2',
                variant === 'destructive' ? 'text-destructive' : 'text-primary'
              )}
            />
          </div>
          <div className="my-3 text-left sm:mt-0 sm:ml-4">
            <Heading
              slot="title"
              className="!text-base !pt-2 text-left font-semibold text-foreground"
            >
              {title}
            </Heading>
            <div className="mt-2">
              <p className="text-gray-500 text-sm">{message}</p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

interface AlertDialogCallParams {
  title: string
  message: string
  variant?: AlertDialogVariant
  cancelButtonTitle?: string
  buttonTitle?: string
}

export const AlertDialog = {
  call: (params: AlertDialogCallParams): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      root.render(
        <AlertDialogComponent
          {...params}
          onConfirm={() => {
            cleanup()
            resolve(true)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )

      setTimeout(() => {
        cleanup()
        resolve(false)
      }, 500000)
    })
  },

  Root: () => null
}
