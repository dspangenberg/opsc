import { X } from 'lucide-react'
import type React from 'react'
import { composeRenderProps, useLocale } from 'react-aria-components'
import { cn } from '@/Lib/utils'

import { AlertDialog } from './alert-dialog'
import { Button } from './button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  type DialogProps,
  type DialogRenderProps,
  DialogTitle,
  DialogTrigger,
  type ReactNodeOrString
} from './dialog'

interface ExtendedDialogProps extends Omit<DialogProps, 'onBeforeClose' | 'children'> {
  children: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  footer?: React.ReactNode | ((renderProps: DialogRenderProps) => React.ReactNode)
  role?: 'alertdialog' | 'dialog'
  showDescription?: boolean
  title?: string
  description?: ReactNodeOrString
  bodyClass?: string
  className?: string
  footerClassName?: string
  bodyPadding?: boolean
  width?: 'default' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'md' | 'lg'
  hideHeader?: boolean
  background?: 'accent' | 'sidebar' | 'background' | 'page'
  confirmClose?: boolean
  confirmationTitle?: string
  confirmationMessage?: string
  confirmationButtonTitle?: string
  confirmationCancelButtonTitle?: string
  confirmationVariant?: 'default' | 'destructive'
}

export const ExtendedDialog: React.FC<ExtendedDialogProps> = ({
  children,
  footer,
  role = 'dialog',
  showDescription = false,
  title = 'Dialog',
  description,
  bodyClass,
  footerClassName = '',
  bodyPadding = false,
  width = 'default',
  hideHeader = false,
  background = 'page',
  className,
  confirmClose = false,
  confirmationTitle,
  confirmationVariant = 'default',
  confirmationCancelButtonTitle,
  confirmationButtonTitle,
  confirmationMessage,
  isDismissible = true,
  ...dialogProps
}) => {
  const { locale } = useLocale()

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
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl'
  }[width]

  const realConfirmatioTitle = confirmationTitle
    ? confirmationTitle
    : locale.startsWith('de')
      ? 'Änderungen verwerfen'
      : 'Discard changes'

  const realConfirmationMessage = confirmationMessage
    ? confirmationMessage
    : locale.startsWith('de')
      ? 'Möchtest Du die Änderungen verwerfen?'
      : 'Do you want to discard the changes?'

  const realConfirmationButtonTitle = confirmationButtonTitle
    ? confirmationButtonTitle
    : locale.startsWith('de')
      ? 'Verwerfen'
      : 'Discard'

  const realConfirmationCancelButtonTitle = confirmationCancelButtonTitle
    ? confirmationCancelButtonTitle
    : locale.startsWith('de')
      ? 'Abbrechen'
      : 'Cancel'

  const handleBeforeClose = async (): Promise<boolean> => {
    if (!confirmClose) {
      return true
    }

    return new Promise<boolean>(resolve => {
      setTimeout(async () => {
        try {
          const result = await AlertDialog.call({
            title: realConfirmatioTitle,
            message: realConfirmationMessage,
            buttonTitle: realConfirmationButtonTitle,
            cancelButtonTitle: realConfirmationCancelButtonTitle,
            variant: confirmationVariant
          })

          resolve(result)
        } catch (error) {
          console.error('Error in confirmation dialog:', error)
          resolve(false)
        }
      }, 100)
    })
  }

  return (
    <Dialog
      {...dialogProps}
      isDismissible={isDismissible}
      onBeforeClose={handleBeforeClose}
      _skipContentWrapper={true}
    >
      <DialogContent
        closeButton={false}
        role={role}
        className={cn(
          'relative flex w-full flex-col gap-0 space-y-0 rounded-lg',
          widthClass,
          className
        )}
      >
        {composeRenderProps(children, (children, providedRenderProps: DialogRenderProps) => {
          const renderProps: DialogRenderProps = {
            close: providedRenderProps.close
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
    </Dialog>
  )
}

export { DialogTrigger }
