import type React from 'react'
import {
  composeRenderProps,
  OverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode;
}

const styles = tv({
  base: 'group bg-foreground text-white text-sm rounded-md will-change-transform py-1.5 px-3',
  variants: {
    isEntering: {
      true: 'animate-in fade-in  duration-200'
    },
    isExiting: {
      true: 'animate-out fade-out duration-150'
    }
  }
})

export function Tooltip ({
  children,
  ...props
}: TooltipProps) {
  return (
    <AriaTooltip {...props} offset={8}
       className={composeRenderProps(props.className, (className, renderProps) => styles({
         ...renderProps,
         className
       }))}
    >
      <OverlayArrow>
        <svg
          width={8}
          height={8}
          data-placement={props.placement}
          viewBox="0 0 8 8"
          className="fill-bg-foreground forced-colors:fill-[Canvas] data-[placement=bottom]:rotate-180 stroke-primary data-[placement=left]:-rotate-90 data-[placement=right]:rotate-90"
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
