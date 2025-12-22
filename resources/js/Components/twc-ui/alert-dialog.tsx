import { Alert02Icon, HelpCircleIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useRef } from 'react'
import { Heading, useLocale } from 'react-aria-components'
import { createRoot } from 'react-dom/client'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { Dialog, DialogBody, DialogContent, DialogFooter } from './dialog'
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
  cancelButtonTitle,
  onConfirm,
  onCancel
}) => {
  const { locale } = useLocale()
  const dismissed = useRef<boolean>(false)

  const realCancelButtonTitle = cancelButtonTitle
    ? cancelButtonTitle
    : locale.startsWith('de')
      ? 'Abbrechen'
      : 'Cancel'

  const icon =
    variant === 'destructive'
      ? Alert02Icon
      : variant === 'info'
        ? InformationCircleIcon
        : HelpCircleIcon

  return (
    <Dialog
      isOpen={true}
      onOpenChange={open => {
        if (open) {
          dismissed.current = false
        } else if (!dismissed.current) {
          setTimeout(() => {
            onCancel()
          }, 50)
        }
      }}
      isDismissible={true}
      _skipContentWrapper={true}
    >
      <DialogContent closeButton={false} role="alertdialog" className="z-100 max-w-xl bg-white">
        <DialogBody className="px-4 py-0 pb-3">
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
              <div className="text-left sm:mt-0 sm:ml-4">
                <Heading
                  slot="title"
                  className="pt-2! text-left font-semibold text-foreground text-lg!"
                >
                  {title}
                </Heading>
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">{message}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex flex-col-reverse items-center justify-end space-x-2 rounded-b-lg bg-muted/40! px-4 py-4 sm:flex-row sm:justify-end sm:space-x-2">
          {variant !== 'info' && (
            <Button
              autoFocus
              variant="outline"
              onClick={() => {
                dismissed.current = true
                setTimeout(() => {
                  onCancel()
                }, 50)
              }}
            >
              {realCancelButtonTitle}
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
        </DialogFooter>
      </DialogContent>
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
