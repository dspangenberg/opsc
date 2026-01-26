import type React from 'react'
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  composeRenderProps,
  OverlayArrow,
  TooltipTrigger
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode
}

const tooltipVariants = tv({
  base: 'group rounded-md bg-foreground px-3 pt-1.5 pb-1 text-sm text-white will-change-transform',
  variants: {
    isEntering: {
      true: 'fade-in animate-in duration-200'
    },
    isExiting: {
      true: 'fade-out animate-out duration-150'
    }
  }
})

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      {...props}
      offset={8}
      className={composeRenderProps(props.className, (className, renderProps) =>
        tooltipVariants({
          isEntering: renderProps.isEntering,
          isExiting: renderProps.isExiting,
          className
        })
      )}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          data-placement={props.placement}
          viewBox="0 0 8 8"
          className="placement-bottom:rotate-180 placement-left:-rotate-90 placement-right:rotate-90 fill-foreground stroke-foreground"
        >
          <title>Tooltip-Arrow</title>
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  )
}

export { TooltipTrigger }
