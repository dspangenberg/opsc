/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

'use client'

import * as React from 'react'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import type { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '@/Components/ui/button'
import { toggleVariants } from '@/Components/ui/toggle'
import { cn } from '@/Lib/utils'

const ToolbarToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'sm',
  variant: 'default'
})

function Toolbar({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Root>) {
  return (
    <ToolbarPrimitive.Root
      className={cn('bg-sidebar flex items-center justify-end space-x-2 p-1', className)}
      {...props}
    >
      {children}
    </ToolbarPrimitive.Root>
  )
}

Toolbar.displayName = ToolbarPrimitive.Root.displayName

const ToolbarButton = React.forwardRef<
  React.ElementRef<typeof ToolbarPrimitive.Button>,
  React.ComponentPropsWithoutRef<typeof ToolbarPrimitive.Button> &
    VariantProps<typeof buttonVariants>
>(({ className, variant, size = 'sm', ...props }, ref) => (
  <ToolbarPrimitive.Button
    ref={ref}
    className={cn(buttonVariants({ variant, size, className }))}
    {...props}
  />
))
ToolbarButton.displayName = ToolbarPrimitive.Button.displayName

function ToolbarToggleGroup({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleGroup> &
  React.ComponentProps<typeof ToolbarToggleGroupContext.Provider>['value']) {
  return (
    <ToolbarPrimitive.ToggleGroup
      className={cn('flex items-center justify-center gap-1', className)}
      {...props}
    >
      <ToolbarToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToolbarToggleGroupContext.Provider>
    </ToolbarPrimitive.ToggleGroup>
  )
}

ToolbarToggleGroup.displayName = ToolbarPrimitive.ToggleGroup.displayName

function ToolbarToggleItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToggleItem>) {
  const context = React.useContext(ToolbarToggleGroupContext)

  return (
    <ToolbarPrimitive.ToggleItem
      className={cn(
        toggleVariants({
          variant: context.variant,
          size: context.size
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToolbarPrimitive.ToggleItem>
  )
}

ToolbarToggleItem.displayName = ToolbarPrimitive.ToggleItem.displayName

function ToolbarSeparator({
  className,
  orientation = 'vertical',
  decorative = true,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.Separator>) {
  return (
    <ToolbarPrimitive.Separator
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'bg-border shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-7' : 'h-7 w-[1px]',
        className
      )}
      {...props}
    />
  )
}

ToolbarSeparator.displayName = ToolbarPrimitive.Separator.displayName

function ToolbarLink({
  className,
  ...props
}: React.ComponentProps<typeof ToolbarPrimitive.ToolbarLink>) {
  return (
    <ToolbarPrimitive.Link
      className={cn(buttonVariants({ variant: 'link' }), className)}
      {...props}
    />
  )
}

ToolbarLink.displayName = ToolbarPrimitive.Link.displayName

export {
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
  ToolbarLink,
  ToolbarToggleGroup,
  ToolbarToggleItem
}
