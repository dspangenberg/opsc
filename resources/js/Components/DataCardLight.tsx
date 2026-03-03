/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import React, { Children, type FC, type ReactElement, type ReactNode } from 'react'
import { ScrollCard } from '@/Components/twc-ui/scroll-card'
import { cn } from '@/Lib/utils'

export interface DataCardProps {
  title?: string
  header?: ReactNode
  children: ReactNode
  className?: string
}

export const DataCardLight: FC<DataCardProps> = ({
  children,
  title = '',
  className = ''
}: DataCardProps) => {
  return (
    <ScrollCard
      className="flex flex-1 overflow-y-hidden bg-background"
      innerClassName="overflow-y-hidden"
    >
      <div className={cn('flex w-full max-w-sm flex-1 flex-col rounded-lg', className)}>
        {title && <DataCardHeader title={title} />}
        <div className="flex-1 overflow-y-auto rounded-lg">{children}</div>
      </div>
    </ScrollCard>
  )
}

export interface DataCardHeaderProps {
  title?: string
  className?: string
  children?: ReactNode
}

export const DataCardHeader: FC<DataCardHeaderProps> = ({
  title = '',
  children = null,
  className = ''
}: DataCardHeaderProps) => {
  return (
    <div
      className={cn(
        'flex-none overflow-x-hidden hyphens-auto text-wrap rounded-t-lg border-border/50 border-b bg-muted/50 px-4 py-2.5 font-medium text-base text-foreground',
        className
      )}
    >
      {children || title}
    </div>
  )
}

export interface DataCardContentProps {
  children: ReactNode
  showSecondary?: boolean
}

export const DataCardContent: FC<DataCardContentProps> = ({ children, showSecondary = true }) => {
  const [showSecondarySections, setShowSecondarySections] = React.useState<boolean>(showSecondary)

  const allChildren = Children.toArray(children)
  const filteredChildren = allChildren.filter(
    (child): child is ReactElement<DataCardSectionProps> => {
      if (React.isValidElement<DataCardSectionProps>(child) && typeof child.type !== 'string') {
        return showSecondarySections || child.props.secondary !== true
      }
      return false
    }
  )

  const onShowSecondaryClicked = () => {
    setShowSecondarySections(true)
  }

  return (
    <div className="">
      <div className="my-1 overflow-y-auto">
        {showSecondarySections ? allChildren : filteredChildren}
      </div>
      {!showSecondarySections && allChildren.length > filteredChildren.length && (
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center overflow-y-auto text-center text-xs hover:underline"
          onClick={onShowSecondaryClicked}
        >
          Details anzeigen
        </button>
      )}
    </div>
  )
}
export interface DataCardSectionProps {
  className?: string
  children?: ReactNode
  minChildren?: number
  title?: string
  buttonVariant?: 'ghost' | 'outline'
  addon?: string | ReactNode
  forceChildren?: boolean
  icon?: globalThis.IconSvgElement | string
  buttonTooltip?: string
  secondary?: boolean
  emptyText?: string
  suppressEmptyText?: boolean
  onClick?: () => void
}

export const DataCardSection: FC<DataCardSectionProps> = ({
  children,
  className = '',
  emptyText = 'Keine Daten vorhanden',
  addon = '',
  forceChildren = false,
  suppressEmptyText = false,
  title = ''
}: DataCardSectionProps) => {
  const getValidChildren = (children: ReactNode) => {
    return Children.toArray(children).filter(
      (child): child is ReactElement<DataCardFieldProps> =>
        React.isValidElement(child) &&
        typeof child.type === 'function' &&
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

  return (
    <div
      className={cn(
        'group max-w-sm',
        !hasValidChildren && !forceChildren && suppressEmptyText ? 'hidden' : ''
      )}
    >
      {title && <DataCardSectionHeader title={title} addon={addon} />}
      <div
        className={cn(
          'flex w-full flex-1 flex-col space-y-2 truncate hyphens-auto border-border/50 border-t bg-background px-4 pt-1.5 pb-0.5 text-base',
          className
        )}
      >
        {hasValidChildren || forceChildren
          ? children
          : !suppressEmptyText && <div className="text-foreground/40 text-sm">{emptyText}</div>}
      </div>
    </div>
  )
}

interface DataFieldGroupProps {
  children: ReactNode
  className?: string
}

export const DataCardFieldGroup: FC<DataFieldGroupProps> = ({
  children,
  className = ''
}: DataFieldGroupProps) => {
  return <div className={cn('truncate text-foreground/50 text-sm', className)}>{children}</div>
}

interface DataCardSectionHeaderProps {
  title?: string
  children?: ReactNode
  className?: string
  addon?: string | ReactNode
}

export const DataCardSectionHeader: FC<DataCardSectionHeaderProps> = ({
  children = '',
  title = '',
  className = '',
  addon = ''
}: DataCardSectionHeaderProps) => {
  return (
    <div className="mt-2 flex items-center border-border/50 border-t border-b bg-muted/50 pt-2 pr-0.5 pb-1 pl-4 font-medium text-black text-sm leading-relaxed">
      <div className={cn('flex-1 pb-1', className)}>{children || title}</div>
      <div className="flex-none text-right">{addon}</div>
    </div>
  )
}

export interface DataCardFieldProps {
  className?: string
  children?: ReactNode
  variant?: 'horizontal' | 'vertical' | 'horizontal-right'
  label: string
  value?: string | number | null | string[]
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
  if (!value && !empty) {
    return null
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
  return <div className={cn('truncate pb-0.5 text-foreground/50 text-sm', className)}>{label}:</div>
}

export interface DataCardFieldCommonProps {
  className?: string
  label: string
  value?: string | number | null | string[]
  children?: ReactNode
}

export const DataCardFieldHorizontal: FC<DataCardFieldCommonProps> = ({
  label,
  value,
  children,
  className = ''
}: DataCardFieldCommonProps) => {
  return (
    <div className={cn('flex text-sm', className)}>
      <DataCardFieldLabel label={label} className="w-[40%] flex-none truncate" />
      <div className="m flex-1 font-medium text-black">{value || children}</div>
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
      <div className="flex-1 text-right text-foreground">{value || children}</div>
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
    <div className={cn('block w-full flex-1', className)}>
      <DataCardFieldLabel className="block" label={label} />
      <div className="block truncate text-black text-sm">{children || value}</div>
    </div>
  )
}
