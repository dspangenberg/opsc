import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { LoaderCircleIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import type React from 'react'
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from 'sonner'
import { tv } from 'tailwind-variants'
import { StatusIcon } from '@/Components/twc-ui/status-icon'
import { Button } from './button'
import { Icon } from './icon'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group font-sans!"
      toastOptions={{
        unstyled: false,
        duration: 5000,
        className: 'font-sans!'
      }}
      style={
        {
          '--font-sans': 'var(--font-sans)',
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)'
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'default'

interface ToastProps {
  title?: string
  message: string
  type?: ToastVariant
  isDismissible?: boolean
  isLoading?: boolean
  duration?: number
  button?: {
    label: string
    onClick: () => void
  }
  id: string | number
}

export const toastStyles = tv({
  base: 'relative flex min-w-96 items-center gap-3 rounded-lg p-4 font-sans shadow-lg ring-1',
  variants: {
    type: {
      default: 'bg-white text-gray-900 ring-black/5 dark:bg-gray-950 dark:text-gray-100',
      success:
        'bg-white text-green-900 ring-green-500/10 dark:bg-green-950 dark:text-green-100 dark:ring-green-500/20',
      error:
        'bg-white text-red-900 ring-red-500/10 dark:bg-red-950 dark:text-red-100 dark:ring-red-500/20',
      warning:
        'bg-white text-yellow-900 ring-yellow-500/10 dark:bg-yellow-950 dark:text-yellow-100 dark:ring-yellow-500/20',
      info: 'bg-white text-blue-900 ring-blue-500/10 dark:bg-blue-950 dark:text-blue-100 dark:ring-blue-500/20'
    }
  },
  defaultVariants: {
    type: 'default'
  }
})

const Toast = (props: ToastProps) => {
  const { title, message, button, isDismissible = true, isLoading, type = 'default', id } = props

  const handleButtonClick = () => {
    if (button?.onClick) {
      button.onClick()
    }
    sonnerToast.dismiss(id)
  }

  const getStatusIconVariant = (
    toastType: ToastVariant
  ): 'default' | 'success' | 'warning' | 'info' | 'destructive' => {
    switch (toastType) {
      case 'success':
        return 'success'
      case 'error':
        return 'destructive'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <div className={toastStyles({ type })}>
      <div className="flex flex-1 items-center gap-3">
        {isLoading ? (
          <LoaderCircleIcon className="size-5 shrink-0 animate-spin text-card-foreground/50" />
        ) : (
          <StatusIcon variant={getStatusIconVariant(type)} />
        )}
        <div className="flex flex-1 flex-col gap-1">
          {title && <p className="font-medium text-sm">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>
        {button && (
          <Button
            variant="outline"
            title={button.label}
            onClick={handleButtonClick}
            className="shrink-0"
          />
        )}
      </div>
      {isDismissible && !isLoading && (
        <button
          onClick={() => sonnerToast.dismiss(id)}
          type="button"
          className="absolute -top-2 -left-2 flex size-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground pressed:shadow-black/20 shadow-sm transition-colors hover:bg-accent hover:text-foreground active:translate-y-px active:shadow-inner active:brightness-95"
          aria-label="Close"
        >
          <Icon icon={Cancel01Icon} className="size-3" />
        </button>
      )}
    </div>
  )
}

interface PromiseToastOptions<T = unknown> {
  type?: ToastVariant
  title?: string
  message: string
  isLoading?: boolean
  isDismissible?: boolean
  success?: string | ((data: T) => string)
  error?: string | ((error: unknown) => string)
  duration?: number
}

interface ToastOptions extends Omit<Partial<ToastProps>, 'id'> {
  id?: string | number
}

const toast = (props: string | number | ToastOptions, type?: ToastVariant) => {
  if (typeof props === 'string' || typeof props === 'number') {
    return sonnerToast.custom(id => <Toast id={id} title="" message={String(props)} type={type} />)
  }

  return sonnerToast.custom(
    id => (
      <Toast
        id={id}
        isLoading={props.isLoading}
        isDismissible={!props.isLoading || props.isDismissible}
        title={props.title ?? ''}
        message={props.message ?? ''}
        button={props.button}
        type={props.type}
      />
    ),
    props.id
      ? { id: props.id, duration: props.duration ?? 10000 }
      : { duration: props.duration ?? 10000 }
  )
}

toast.promise = <T,>(promise: Promise<T>, options: PromiseToastOptions<T>) => {
  const { type, title, message, isLoading, isDismissible, success, error, duration } = options
  const id = crypto.randomUUID()

  sonnerToast.custom(
    id => (
      <Toast
        id={id}
        title={title}
        message={message}
        type={type ?? 'default'}
        isLoading
        isDismissible={isDismissible ?? !isLoading}
      />
    ),
    { id, duration: Infinity }
  )

  promise
    .then(data => {
      sonnerToast.custom(
        id => (
          <Toast
            id={id}
            title={title}
            message={typeof success === 'function' ? success(data) : (success ?? message)}
            type={type ?? 'success'}
          />
        ),
        { id, duration }
      )
    })
    .catch(err => {
      sonnerToast.custom(
        id => (
          <Toast
            id={id}
            title={title}
            message={typeof error === 'function' ? error(err) : (error ?? message)}
            type={type ?? 'error'}
          />
        ),
        { id, duration }
      )
    })

  return id
}

export type { PromiseToastOptions }
export { Toast, Toaster, toast }
