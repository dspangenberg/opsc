import { cva, type VariantProps } from 'class-variance-authority'
import type React from 'react'
import { createContext, useContext } from 'react'
import {
  Toolbar as AriaToolbar,
  type ToolbarProps as AriaToolbarProps,
  composeRenderProps
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button, type ButtonProps } from './button'

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
  isDisabled?: boolean
}

type ToolbarContextType = {
  isDisabled?: boolean
}

const ToolbarContext = createContext<ToolbarContextType>({
  isDisabled: false
})

const useToolbarContext = () => {
  const context = useContext(ToolbarContext)
  if (!context) {
    throw new Error('Tab components must be used within a Tabs component')
  }
  return context
}

export const Toolbar = ({ variant, isDisabled, ...props }: ToolbarProps) => {
  return (
    <ToolbarContext.Provider value={{ isDisabled }}>
      <AriaToolbar
        {...props}
        className={composeRenderProps(props.className, className =>
          cn(toolbarVariants({ variant }), className)
        )}
      />
    </ToolbarContext.Provider>
  )
}

interface ToolbarButtonProps extends Omit<ButtonProps, 'variant'> {
  isDisabled?: boolean
  variant?: 'default' | 'primary'
}

export const ToolbarButton = ({
  variant = 'default',
  isDisabled = false,
  ...props
}: ToolbarButtonProps) => {
  const { isDisabled: isContextDisabled } = useToolbarContext()
  const realVariant = variant === 'primary' ? 'toolbar-default' : 'toolbar'

  return <Button variant={realVariant} isDisabled={isContextDisabled || isDisabled} {...props} />
}
