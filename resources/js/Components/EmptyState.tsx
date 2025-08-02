/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Button } from '@/Components/ui/twc-ui/button'
import { cn } from '@/Lib/utils'
import { Add01Icon, GeometricShapes01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
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
        'flex w-full flex-col items-center justify-center space-y-6 rounded-lg py-6 text-center text-base text-muted-foreground leading-normal',
        className
      )}
    >
      <div className="motion-rotate-loop-[6deg] motion-loop-once motion-ease-spring-bounciest">
        <HugeiconsIcon icon={icon} size={28} className="mx-auto " />
      </div>
      <div>{children}</div>
      <Button
        variant="toolbar-default"
        title={buttonLabel}
        icon={buttonIcon}
        onClick={onClick}
        iconClassName="text-primary"
      />
    </div>
  )
}
