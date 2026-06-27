import { MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import type { AriaMenuTriggerProps } from 'react-aria'
import type { PopoverProps } from 'react-aria-components'
import type { VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import type { buttonVariants } from './button'
import { Button } from './button'
import type { IconType } from './icon'
import { type AriaMenuProps, Menu, MenuItem, MenuPopover, MenuTrigger } from './menu'

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
  variant = 'ghost',
  placement = 'bottom right',
  selectionMode = undefined,
  selectedKeys = undefined,
  triggerElement = undefined,
  isDisabled,
  menuClassName = undefined,
  size = 'icon',
  icon = undefined,
  iconClassName = undefined,
  className = undefined,
  onSelectionChange,
  ...props
}: DropdownButtonProps<T>) {
  const realIcon = icon ? icon : MoreVerticalCircle01Icon

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
          icon={realIcon}
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

export type { DropdownButtonProps }
export { DropdownButton, MenuItem }
