import { CircleCheck, Info, Loader, TriangleAlert, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import type React from 'react'
import { Toaster as Sonner, toast as sonnerToast, type ToasterProps } from 'sonner'
import { tv } from 'tailwind-variants'
import { Button } from './button'
import { Icon } from './icon'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        duration: 5000,
        className: 'w-full md:max-w-[320px]'
      }}
      style={
        {
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

type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default'

interface ToastProps {
  title?: string
  message: string
  type?: ToastVariant
  button?: {
    label: string
    onClick: () => void
  }
  id: string | number
}

export const toastStyles = tv({
  base: 'flex w-full items-center gap-3 rounded-lg p-4 font-sans shadow-lg ring-1',
  variants: {
    type: {
      default: 'bg-white text-gray-900 ring-black/5 dark:bg-gray-950 dark:text-gray-100',
      success:
        'bg-green-50 text-green-900 ring-green-500/10 dark:bg-green-950 dark:text-green-100 dark:ring-green-500/20',
      error:
        'bg-red-50 text-red-900 ring-red-500/10 dark:bg-red-950 dark:text-red-100 dark:ring-red-500/20',
      warning:
        'bg-yellow-50 text-yellow-900 ring-yellow-500/10 dark:bg-yellow-950 dark:text-yellow-100 dark:ring-yellow-500/20',
      info: 'bg-blue-50 text-blue-900 ring-blue-500/10 dark:bg-blue-950 dark:text-blue-100 dark:ring-blue-500/20',
      loading:
        'bg-white text-gray-900 ring-black/5 dark:bg-gray-950 dark:text-gray-100 dark:ring-gray-500/20'
    }
  },
  defaultVariants: {
    type: 'default'
  }
})

const Toast = (props: ToastProps) => {
  const { title, message, button, type = 'success' } = props

  const IconComponent: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
    default: Info,
    success: CircleCheck,
    error: X,
    warning: TriangleAlert,
    info: Info,
    loading: Loader
  }

  return (
    <div className={toastStyles({ type })}>
      <Icon icon={IconComponent[type]} className="size-5 shrink-0" />
      <div className="flex flex-1 flex-col gap-1">
        {title && <p className="font-medium text-sm">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      {button && (
        <Button
          variant="default"
          title={button.label}
          onClick={button.onClick}
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

  return sonnerToast.custom(id => (
    <Toast
      id={id}
      title={props.title}
      message={props.message}
      button={props.button}
      type={props.type}
    />
  ))
}

export { Toast, Toaster, toast }
