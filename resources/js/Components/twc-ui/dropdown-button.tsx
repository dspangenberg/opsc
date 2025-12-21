import type { VariantProps } from 'class-variance-authority'
import type * as React from 'react'
import type { AriaMenuTriggerProps } from 'react-aria'
import type { PopoverProps } from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Button, type buttonVariants } from './button'
import type { IconType } from './icon'
import { type AriaMenuProps, Menu, MenuPopover, MenuTrigger } from './menu'

interface DropdownButtonProps<T>
  extends AriaMenuProps<T>,
    VariantProps<typeof buttonVariants>,
    Omit<AriaMenuTriggerProps, 'children'> {
  title?: string
  icon?: IconType
  className?: string
  iconClassName?: string
  triggerElement?: React.ReactNode
  isDisabled?: boolean
  menuClassName?: string
  placement?: PopoverProps['placement']
  selectionMode?: AriaMenuProps<T>['selectionMode']
  selectedKeys?: AriaMenuProps<T>['selectedKeys']
  onSelectionChange?: AriaMenuProps<T>['onSelectionChange']
}
function DropdownButton<T extends object>({
  title,
  children,
  variant,
  placement = 'bottom right',
  selectionMode = undefined,
  selectedKeys = undefined,
  triggerElement = undefined,
  isDisabled,
  menuClassName = undefined,
  size = 'icon',
  icon,
  iconClassName = undefined,
  className = undefined,
  onSelectionChange,
  ...props
}: DropdownButtonProps<T>) {
  return (
    <MenuTrigger {...props}>
      {triggerElement ? (
        triggerElement
      ) : (
        <Button
          variant={variant}
          className={className}
          size={size}
          isDisabled={isDisabled}
          iconClassName={iconClassName}
          icon={icon}
          title={title}
        />
      )}
      <MenuPopover className={cn(menuClassName, 'min-w-[--trigger-width')} placement={placement}>
        <Menu
          selectionMode={selectionMode}
          selectedKeys={selectedKeys}
          onSelectionChange={onSelectionChange}
        >
          {children}
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}

export { DropdownButton }
export type { DropdownButtonProps }
