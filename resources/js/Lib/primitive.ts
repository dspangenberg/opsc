import { composeRenderProps } from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { tv } from "tailwind-variants"

function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tailwind: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tailwind, className))
}

// "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
const focusRing = tv({
  variants: {
    isFocused: { true: "outline-hidden   ring-[3px] ring-ring/50 data-invalid:ring-danger/20" },
    isFocusVisible: { true: "outline-hidden ring-[3px] ring-ring/50" },
    isInvalid: { true: "ring-[3px] ring-danger/20" },
  },
})

const focusStyles = tv({
  extend: focusRing,
  variants: {
    isFocused: { true: "border-ring/50 forced-colors:border-[Highlight]" },
    isInvalid: { true: "border-danger/70 forced-colors:border-[Mark]" },
  },
})

export { composeTailwindRenderProps, focusRing, focusStyles }
