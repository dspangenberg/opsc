'use client'

import type React from 'react'
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  type GridListItemProps as AriaGridListItemProps,
  type GridListProps as AriaGridListProps,
  composeRenderProps
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { focusRing } from '@/Lib/utils'

const gridListStyles = tv({
  base: 'flex flex-col gap-0.5 overflow-auto rounded-lg border bg-background p-1 outline-none',
  variants: {
    isFocusVisible: {
      true: 'ring-2 ring-ring ring-offset-2 ring-offset-background'
    }
  }
})

export interface GridListProps<T> extends Omit<AriaGridListProps<T>, 'className'> {
  className?: string
}

export const GridList = <T extends object>({ children, className, ...props }: GridListProps<T>) => {
  return (
    <AriaGridList
      {...props}
      className={composeRenderProps(className, (className, renderProps) =>
        gridListStyles({ ...renderProps, className })
      )}
    >
      {children}
    </AriaGridList>
  )
}

const gridListItemStyles = tv({
  extend: focusRing,
  base: 'group relative flex cursor-default select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none transition-colors',
  variants: {
    isSelected: {
      true: 'bg-accent text-accent-foreground'
    },
    isHovered: {
      true: 'bg-accent text-accent-foreground'
    },
    isDisabled: {
      true: 'pointer-events-none opacity-50'
    },
    isFocusVisible: {
      true: 'ring-2 ring-ring ring-offset-1'
    }
  }
})

interface GridListItemProps extends AriaGridListItemProps {
  onDoubleClick?: () => void
}

export const GridListItem = ({ onDoubleClick, ...props }: GridListItemProps) => {
  return (
    <AriaGridListItem
      {...props}
      onDoubleClick={onDoubleClick}
      className={composeRenderProps(props.className, (className, renderProps) =>
        gridListItemStyles({ ...renderProps, className })
      )}
    />
  )
}
