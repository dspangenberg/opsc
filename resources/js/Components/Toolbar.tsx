/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Button, type ButtonProps } from '@/Components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { cn } from '@/Lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import type { TabsProps, TabsTriggerProps } from '@radix-ui/react-tabs'
import type React from 'react'
import type { ReactNode } from 'react'

type ReactNodeOrString = ReactNode | string

interface ToolbarProps {
  children: ReactNode
  title: ReactNodeOrString
  tabs?: ReactNode
  className?: string
  activeView: string
}

interface ToolbarButtonProps extends Omit<ButtonProps, 'variant'> {
  variant: 'primary' | 'default' | 'dropdown'
  label: string
  icon?: globalThis.IconSvgElement
  children?: ReactNode
}

interface ToolbarTabsProps extends TabsProps {
  children: ReactNode
}

interface ToolbarTabProps extends TabsTriggerProps {
  children: ReactNode
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, title, className, tabs }) => {
  return (
    <>
      <div
        className={cn(
          'toolbar',
          'flex items-center py-2 space-y-4 my-3 flex-1',
          className,
          tabs && 'border-0'
        )}
      >
        <div className="flex items-center flex-1">
          <div className="flex-1 items-center flex">
            <h2 className="text-xl font-medium text-foreground">{title}</h2>
          </div>
          <div className="shrink-0 ml-4 space-x-2">{children}</div>
        </div>
      </div>
      {tabs && <div className="border-b rounded-none shadow-none my-3">{tabs}</div>}
    </>
  )
}

export const ToolbarTabs: React.FC<ToolbarTabsProps> = ({
  children,
  ...props
}: ToolbarTabsProps) => {
  return (
    <Tabs {...props}>
      <TabsList className="bg-transparent border-b w-full justify-start">{children}</TabsList>
    </Tabs>
  )
}

export const ToolbarTab: React.FC<ToolbarTabProps> = ({ children, ...props }: ToolbarTabProps) => {
  return (
    <TabsTrigger {...props} className={'xxx'}>
      {children}
    </TabsTrigger>
  )
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  variant,
  label,
  children,
  ...props
}) => {
  const iconElement = props.icon ? (
    <HugeiconsIcon icon={props.icon} className="text-primary" size={16} strokeWidth={2} />
  ) : null

  if (variant === 'primary') {
    return (
      <Button variant="outline" className="aspect-square max-sm:p-0 items-center" {...props}>
        {iconElement && <span className="sm:-ms-1 sm:me-2">{iconElement}</span>}
        <span className="max-sm:sr-only text-foreground">{label}</span>
      </Button>
    )
  }

  if (variant === 'default') {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={label} {...props}>
            {iconElement}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">{label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} {...props}>
          {iconElement}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
