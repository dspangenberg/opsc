/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Children, type FC, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/Lib/utils'
import React from 'react'
import { Button } from '@dspangenberg/twcui'

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
        'flex-none w-full shadow border-border/50 bg-background border-t rounded-md',
        className
      )}
    >
      {title && <DataCardHeader title={title} />}
      {children}
    </div>
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
        'flex-none text-lg bg-sidebar font-medium text-foreground px-4 py-2.5 border-border/50 border-b rounded-t-md',
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onShowSecondaryClicked()
    }
  }

  return (
    <div>
      <div className="space-y-2 divide-y my-1.5">
        {showSecondarySections ? allChildren : filteredChildren}
      </div>
      {!showSecondarySections && allChildren.length > filteredChildren.length && (
        <div
          className="flex items-center bg-accent/50 justify-center text-xs py-2 bg- text-foreground cursor-pointer hover:underline text-center"
          onClick={onShowSecondaryClicked}
          onKeyDown={handleKeyDown}
        >
          <a onClick={onShowSecondaryClicked}>Details anzeigen</a>
        </div>
      )}
    </div>
  )
}
export interface DataCardSectionProps {
  className?: string
  children: ReactNode
  minChildren?: number
  title?: string
  buttonVariant?: 'ghost' | 'outline'
  addonText?: string
  forceChildren?: boolean
  icon?: globalThis.IconSvgElement | string
  secondary?: boolean
  emptyText?: string
  onClick?: () => void
}

export const DataCardSection: FC<DataCardSectionProps> = ({
  children,
  className = '',
  icon = '',
  buttonVariant = 'outline',
  emptyText = 'Keine Daten vorhanden',
  addonText = '',
  forceChildren = false,
  title = '',
  onClick
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

  return (
    <div className={cn('text-base px-4 py-1 w-full flex flex-col group')}>
      {title && (
        <DataCardSectionHeader
          title={title}
          icon={icon}
          addonText={addonText}
          buttonVariant={buttonVariant}
          onClick={onClick}
        />
      )}
      <div className={cn('space-y-2 flex flex-1 flex-col', className)}>
        {hasValidChildren || forceChildren ? (
          children
        ) : (
          <div className="text-foreground/40">{emptyText}</div>
        )}
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
  return <div className={cn('text-foreground/50 text-sm truncate', className)}>{children}</div>
}

interface DataCardSectionHeaderProps {
  title?: string
  children?: ReactNode
  className?: string
  addonText?: string
  icon?: globalThis.IconSvgElement | string
  buttonVariant?: 'ghost' | 'outline'
  onClick?: () => void
}

export const DataCardSectionHeader: FC<DataCardSectionHeaderProps> = ({
  children = '',
  title = '',
  icon = '',
  className = '',
  addonText = '',
  buttonVariant = 'outline',
  onClick
}: DataCardSectionHeaderProps) => {
  return (
    <div className="flex items-center">
      <div className={cn('font-medium pb-1 flex-1', className)}>
        {children || title}
        {addonText && (
          <span className="ml-2 text-foreground/40 text-sm font-normal">{addonText}</span>
        )}
      </div>
      {icon && (
        <div>
          <Button
            variant={buttonVariant}
            size="icon-xs"
            iconClassName="text-primary"
            className="opacity-0 group-hover:opacity-100"
            icon={icon}
            onClick={onClick}
          />
        </div>
      )}
    </div>
  )
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
  return <div className={cn('text-foreground/50 text-sm truncate', className)}>{label}:</div>
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
    <div className={cn('block flex-1 w-full', className)}>
      <DataCardFieldLabel className="block" label={label} />
      <div className="text-foreground block">{children || value}</div>
    </div>
  )
}
