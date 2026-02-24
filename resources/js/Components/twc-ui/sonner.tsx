import { useTheme } from 'next-themes'
import type React from 'react'
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from 'sonner'
import { tv } from 'tailwind-variants'
import { StatusIcon } from '@/Components/twc-ui/status-icon'
import { Button } from './button'

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
  duration?: number
  button?: {
    label: string
    onClick: () => void
  }
  id: string | number
}

export const toastStyles = tv({
  base: 'flex min-w-96 items-center gap-3 rounded-lg p-4 font-sans shadow-lg ring-1',
  variants: {
    type: {
      default: 'bg-white text-gray-900 ring-black/5 dark:bg-gray-950 dark:text-gray-100',
      success:
        'bg-green-50 text-green-900 ring-green-500/10 dark:bg-green-950 dark:text-green-100 dark:ring-green-500/20',
      error:
        'bg-red-50 text-red-900 ring-red-500/10 dark:bg-red-950 dark:text-red-100 dark:ring-red-500/20',
      warning:
        'bg-yellow-50 text-yellow-900 ring-yellow-500/10 dark:bg-yellow-950 dark:text-yellow-100 dark:ring-yellow-500/20',
      info: 'bg-blue-50 text-blue-900 ring-blue-500/10 dark:bg-blue-950 dark:text-blue-100 dark:ring-blue-500/20'
    }
  },
  defaultVariants: {
    type: 'default'
  }
})

const Toast = (props: ToastProps) => {
  const { title, message, button, type = 'default', id } = props

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
    <div className={toastStyles({ type: 'default' })}>
      <StatusIcon variant={getStatusIconVariant(type)} />
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
  )
}

const toast = (props: string | Omit<ToastProps, 'id'>, type?: ToastVariant) => {
  if (typeof props === 'string') {
    return sonnerToast.custom(id => <Toast id={id} title="" message={props} type={type} />)
  }

  return sonnerToast.custom(
    id => (
      <Toast
        id={id}
        title={props.title}
        message={props.message}
        button={props.button}
        type={props.type}
      />
    ),
    {
      duration: props.duration ?? 10000
    }
  )
}

export { Toast, Toaster, toast }
