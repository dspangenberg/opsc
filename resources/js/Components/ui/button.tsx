import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn, focusRing } from '@/Lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center text-base whitespace-nowrap rounded font-medium transition-colors  focus:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'
  ],
  {
    variants: {
      variant: {
        default:
          'bg-primary border-transparent text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90 hover:text-white active:border-white active:bg-primary focus:outline-0 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:ring-offset-0 active:ring-offset-1',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90',
        outline:
          'border border-input  bg-background shadow-sm shadow-black/5 hover:bg-accent/70 active:bg-accent hover:text-accent-foreground/90 focus:outline-0 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:ring-offset-0 active:outline-0 active:border-blue-300 active:ring active:ring-blue-200 active:border-blue-300 active:ring active:ring-blue-200 active:ring-opacity-50 active:ring-offset-0',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80',
        ghost:
          'hover:bg-accent/70 active:bg-accent  hover:text-accent-foreground focus:outline-0 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:border focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 focus:ring-offset-0',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
