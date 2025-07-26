import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import {
  Toolbar as AriaToolbar,
  type ToolbarProps as AriaToolbarProps,
  composeRenderProps
} from 'react-aria-components'
import { cn } from '@/Lib/utils'

const toolbarVariants = cva('flex gap-1 data-[orientation=vertical]:flex-col', {
  variants: {
    variant: {
      default: '[&>button_svg]:text-primary',
      secondary: '[&>button_svg]:text-foreground'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

interface ToolbarProps
  extends Omit<AriaToolbarProps, 'children'>,
    VariantProps<typeof toolbarVariants> {
  children: React.ReactNode
}

export const Toolbar = ({ variant, ...props }: ToolbarProps) => {
  return (
    <AriaToolbar
      {...props}
      className={composeRenderProps(props.className, className =>
        cn(toolbarVariants({ variant }), className)
      )}
    />
  )
}
