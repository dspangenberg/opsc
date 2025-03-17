/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { HugeiconsIcon } from '@hugeicons/react'
import {
  Children,
  type FC,
  type ReactElement,
  type ReactNode,
  type JSXElementConstructor
} from 'react'
import { cn } from '@/Lib/utils'
import React from 'react'

export interface DataCardProps {
  title?: string
  header?: ReactNode
  children: ReactNode
  className?: string
}

export const DataCard: FC<DataCardProps> = ({
  children,
  title = '',
  className = ''
}: DataCardProps) => {
  return (
    <div
      className={cn(
        'flex-none w-full shadow-sm border-border/50 bg-background border rounded-md',
        className
      )}
    >
      {title && <DataCardHeader title={title} />}
      {children}
    </div>
  )
}

export interface DataCardHeaderProps {
  title: string
  className?: string
}

export const DataCardHeader: FC<DataCardHeaderProps> = ({
  title,
  className = ''
}: DataCardHeaderProps) => {
  return (
    <div
      className={cn(
        'flex-none bg-accent text-lg font-medium text-foreground px-4 py-2.5 border-border/50 border-b rounded-t-md',
        className
      )}
    >
      {title}
    </div>
  )
}

export interface DataCardContentProps {
  children: ReactNode
}

export const DataCardContent: FC<DataCardContentProps> = ({ children }) => {
  return (
    <div className="space-y-2 divide-y my-1.5">
      {Children.map(children, (child, index) => {
        return child
      })}
    </div>
  )
}
export interface DataCardSectionProps {
  className?: string
  children: ReactNode
  minChildren?: number
  title?: string
}

export const DataCardSection: FC<DataCardSectionProps> = ({
  children,
  className = '',
  title = ''
}: DataCardSectionProps) => {
  const getValidChildren = (children: ReactNode) => {
    return Children.toArray(children).filter(
      (child): child is ReactElement<DataCardFieldProps> =>
        React.isValidElement(child) &&
        typeof child.type === 'function' &&
        child.type.name === 'DataCardField' &&
        'props' in child &&
        typeof child.props === 'object' &&
        child.props !== null &&
        'value' in child.props &&
        child.props.value !== null &&
        child.props.value !== undefined
    )
  }

  const validChildren = getValidChildren(children)
  const hasValidChildren = validChildren.length > 0

  if (hasValidChildren) {
    return (
      <div className={cn('flex-none text-base px-4 py-1.5 rounded-t-md')}>
        {title && <DataCardSectionHeader title={title} />}
        <div className={cn('space-y-2', className)}>{validChildren}</div>
      </div>
    )
  }
  return null
}
interface DataCardSectionHeaderProps {
  title?: string
  children?: ReactNode
  className?: string
}

export const DataCardSectionHeader: FC<DataCardSectionHeaderProps> = ({
  children = '',
  title = '',
  className = ''
}: DataCardSectionHeaderProps) => {
  return <div className={cn('font-medium pb-1', className)}>{children || title}</div>
}

export interface DataCardFieldProps {
  className?: string
  children?: ReactNode
  variant?: 'horizontal' | 'vertical' | 'horizontal-right'
  label: string
  value?: string | number | null
  empty?: boolean
}

export const DataCardField: FC<DataCardFieldProps> = ({
  children,
  empty = false,
  variant = 'horizontal-right',
  label,
  value,
  className = ''
}: DataCardFieldProps) => {
  if (value === null || value === undefined) {
    if (!empty && !children) return null
  }

  const props = { label, value, children, className }

  switch (variant) {
    case 'horizontal':
      return <DataCardFieldHorizontal {...props} />
    case 'vertical':
      return <DataCardFieldVertical {...props} />
    default:
      return <DataCardFieldHorizontalRight {...props} />
  }
}

export interface DataCardFieldLabelProps {
  label: string
  className?: string
}

export const DataCardFieldLabel: FC<DataCardFieldLabelProps> = ({
  label,
  className = ''
}: DataCardFieldLabelProps) => {
  return <div className={cn('text-foreground/50 text-sm truncate', className)}>{label}</div>
}

export interface DataCardFieldCommonProps {
  className?: string
  label: string
  value?: string | number | null
  children?: ReactNode
}

export const DataCardFieldHorizontal: FC<DataCardFieldCommonProps> = ({
  label,
  value,
  children,
  className = ''
}: DataCardFieldCommonProps) => {
  return (
    <div className={cn('flex', className)}>
      <DataCardFieldLabel label={label} className="flex-none w-[50%]" />
      <div className="text-foreground flex-1">{value || children}</div>
    </div>
  )
}

export const DataCardFieldHorizontalRight: FC<DataCardFieldCommonProps> = ({
  label,
  value,
  children,
  className = ''
}: DataCardFieldCommonProps) => {
  return (
    <div className={cn('flex', className)}>
      <DataCardFieldLabel label={label} className="flex-none" />
      <div className="text-foreground flex-1 text-right">{value || children}</div>
    </div>
  )
}

export const DataCardFieldVertical: FC<DataCardFieldCommonProps> = ({
  label,
  value,
  children,
  className = ''
}: DataCardFieldCommonProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      <DataCardFieldLabel label={label} />
      <div className="text-foreground">{children || value}</div>
    </div>
  )
}
