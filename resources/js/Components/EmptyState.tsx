/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { ToolbarButton } from '@/Components/Toolbar'
import { cn } from '@/Lib/utils'
import { Add01Icon, GeometricShapes01Icon } from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon} from '@hugeicons/react'
import type React from 'react'
import type { ReactNode } from 'react'


interface Props {
  children: ReactNode
  className?: string
  buttonLabel: string
  icon?: globalThis.IconSvgElement
  buttonIcon?: globalThis.IconSvgElement
  onClick: () => void
}

export const EmptyState: React.FC<Props> = ({
  onClick,
  children,
  className,
  buttonLabel,
  icon = GeometricShapes01Icon,
  buttonIcon = Add01Icon
}) => {
  return (
    <div
      className={cn(
        'empty-state-container',
        'py-6 w-full flex flex-col justify-center space-y-6 items-center text-center rounded-lg text-base leading-normal text-muted-foreground',
        className
      )}
    >
      <div className="motion-rotate-loop-[6deg] motion-loop-once motion-ease-spring-bounciest">
        <HugeiconsIcon icon={icon} size={28} className="mx-auto " />
      </div>
      <div>{children}</div>
      <ToolbarButton
        autoFocus
        variant="primary"
        label={buttonLabel}
        icon={buttonIcon}
        onClick={onClick}
        className="text-black"
      />
    </div>
  )
}
