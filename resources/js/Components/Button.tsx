import { cn } from '@/Lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import type React from 'react'
interface IconProps {
  className: string
  variant: IconVariants
  color: string
  disabled: boolean
}

type IconVariants = 'stroke' | 'fill'

interface ButtonProps {
  focusOnClick?: boolean
  removeBorder?: boolean
  variant?: 'primary' | 'dark' | 'default' | 'danger' | 'danger-ghost' | 'link'
  tag?: 'button' | 'a'
  icon?: string
  href?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  tooltip?: string
  autoFocus?: boolean
  form?: string
  tabIndex?: number
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  iconVariant?: IconVariants
  label?: string
  full?: boolean
  onClick?: () => void
  onSubmit?: () => void
  children?: React.ReactNode | ((props: { iconProps: IconProps }) => React.ReactNode)
}

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:text-opacity-25 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  tag = 'button',
  icon = '',
  href = '',
  label = '',
  className = '',
  disabled = false,
  form = '',
  type = 'button',
  tooltip = '',
  autoFocus = false,
  tabIndex,
  loading = false,
  full = false,
  iconVariant = 'stroke',
  onClick,
  onSubmit,
  children
}) => {
  const iconProps: IconProps = {
    className: `size-5 ${
      disabled
        ? 'text-stone-600 hover:text-gray-400'
        : 'text-stone-500 active:text-black group-hover:text-stone-900'
    }`,
    variant: iconVariant,
    color: 'currentColor',
    disabled: disabled
  }

  const hasLabel = !!children || !!label

  const classes = {
    primary:
      'font-bold! px-2.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 text-white disabled:bg-blue-600/50 disabled:cursor-not-allowed',
    dark: 'flex justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-xs hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
    default:
      'active:bg-neutral-200 disabled:opacity-50 font-medium px-2 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 disabled:bg-neutral-100 disabled:cursor-not-allowed',
    danger:
      'font-medium px-2 py-2 bg-red-600 hover:bg-red-700 text-white active:bg-red-800 focus:ring-red-500',
    'danger-ghost':
      'font-medium px-1.5 py-1 border border-red-600 hover:border-red-800 hover:text-red-800 active:text-white text-red-600 active:bg-red-800 focus:ring-red-500',
    link: 'py-2 bg-transparent hover:text-blue-700 text-blue-500'
  }[variant]

  const handleClick = () => {
    if (tag === 'a') return
    if (!disabled && !loading) {
      if (type === 'submit') {
        onSubmit?.()
      } else {
        onClick?.()
      }
    }
  }

  const commonProps = {
    className: cn(
      'items-center text-base text-center rounded-sm focus:outline-hidden focus:ring-2 inline-flex leading-none focus:ring-offset-2 content-end select-none',
      full ? 'w-full justify-center' : 'w-full md:w-auto',
      classes,
      className
    ),
    autoFocus,
    tabIndex,
    onClick: handleClick,
    title: tooltip
  }

  const renderButton = () => (
    <button {...commonProps} disabled={disabled || loading} type={type} form={form}>
      {loading && <span className="sr-only">Loading...</span>}
      {loading && (
        <svg
          aria-hidden="true"
          className="mx-3 text-white inline w-4 h-4 animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      )}
      <div className="flex items-center text-center">
        {typeof children === 'function' ? (
          children({ iconProps })
        ) : (
          <>
            {icon && <span className={iconProps.className}>{icon}</span>}
            {(hasLabel || label) && (
              <span
                className={hasLabel || label ? 'px-2 w-full block text-center font-bold!' : ''}
              >
                {children || label}
              </span>
            )}
          </>
        )}
      </div>
    </button>
  )

  const renderAnchor = () => (
    <a {...commonProps} href={href}>
      {loading && <span className="sr-only">Loading...</span>}
      {loading && (
        <svg
          aria-hidden="true"
          className="mx-3 text-white inline w-4 h-4 animate-spin"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="#E5E7EB"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      )}
      <div className="flex items-center text-center">
        {typeof children === 'function' ? (
          children({ iconProps })
        ) : (
          <>
            {icon && <span className={iconProps.className}>{icon}</span>}
            {(hasLabel || label) && (
              <span
                className={hasLabel || label ? 'px-2 w-full block text-center font-bold!' : ''}
              >
                {children || label}
              </span>
            )}
          </>
        )}
      </div>
    </a>
  )

  return tag === 'button' ? renderButton() : renderAnchor()
}
