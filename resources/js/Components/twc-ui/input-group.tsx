import type * as React from 'react'
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  composeRenderProps,
  Group,
  type GroupProps
} from 'react-aria-components'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { RACTextArea } from './text-area'

export const inputGroupStyles = (props: React.ComponentProps<'div'>) => {
  return cn(
    'relative flex h-9 w-full items-center overflow-hidden rounded-sm border border-input bg-background py-1 font-medium text-base shadow-none transition-colors',
    'min-w-0 has-[>textarea]:h-auto',

    // Variants based on alignment.
    'has-[>[data-align=inline-start]]:[&>input]:pl-2',
    'has-[>[data-align=inline-end]]:[&>input]:pr-2',
    'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
    'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',

    /* Focus Within */
    'has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-primary/20',
    'has-[[data-slot=input-group-control]:focus-within]:border-primary has-[[data-slot=input-group-control]:focus-within]:ring-[3px] has-[[data-slot=input-group-control]:focus-within]:ring-primary/20',

    /* Invalid */
    'has-[[data-slot][aria-invalid=true]]:border-destructive',
    'has-[[data-slot][aria-invalid=true]:focus-within]:border-destructive has-[[data-slot][aria-invalid=true]:focus-within]:ring-destructive/20',

    /* Disabled */
    'data-[disabled]:opacity-50',

    props.className
  )
}

const InputGroup = ({ className, ...props }: GroupProps) => {
  return (
    <Group
      data-slot="input-group"
      className={composeRenderProps(className, (className, renderProps) =>
        inputGroupStyles({ ...renderProps, className })
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = tv({
  base: "flex h-auto cursor-text select-none items-center justify-center gap-2 border-0 py-1.5 font-medium text-muted-foreground text-sm group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  variants: {
    align: {
      'inline-start': 'order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]',
      'inline-end': 'order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]',
      'block-start':
        'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3',
      'block-end':
        'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3'
    }
  },
  defaultVariants: {
    align: 'inline-start'
  }
})

const InputGroupAddon = ({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) => {
  const handleInteraction = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') {
      return
    }
    e.currentTarget.parentElement?.querySelector('input')?.focus()
  }

  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={inputGroupAddonVariants({ align, className })}
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
      {...props}
    />
  )
}

const inputGroupButtonVariants = tv({
  base: 'flex items-center gap-2 text-sm shadow-none',
  variants: {
    size: {
      xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
      sm: 'h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5',
      'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0',
      'icon-sm': 'size-8 p-0 has-[>svg]:p-0'
    }
  },
  defaultVariants: {
    size: 'xs'
  }
})

const InputGroupButton = ({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) => {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={composeRenderProps(className, className =>
        inputGroupButtonVariants({ size, className })
      )}
      {...props}
    />
  )
}

const InputGroupText = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-muted-foreground text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export const inputGroupInputStyles = tv({
  base: 'flex-1 rounded-none border-0 bg-transparent shadow-none outline-none focus:border-0 focus:ring-0 focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent',
  variants: {
    isFocusVisible: {
      true: 'border-0 ring-0'
    },
    isFocusWithin: {
      true: 'border-0 ring-0'
    }
  }
})

interface InputGroupInputProps extends AriaInputProps {
  ref?: React.Ref<HTMLInputElement>
  passwordrules?: string
}

const InputGroupInput = ({ className, ref, ...props }: InputGroupInputProps) => {
  return (
    <AriaInput
      ref={ref}
      data-slot="input-group-control"
      className={composeRenderProps(className, (className, renderProps) =>
        cn(
          inputGroupInputStyles({ ...renderProps }),
          'px-3 py-1 font-medium text-sm',
          'data-disabled:cursor-not-allowed data-disabled:opacity-50',
          className
        )
      )}
      onFocus={event => event.target.select()}
      {...props}
    />
  )
}

const InputGroupTextarea = ({ className, ...props }: React.ComponentProps<typeof RACTextArea>) => {
  return (
    <RACTextArea
      data-slot="input-group-control"
      className={composeRenderProps(className, className =>
        cn(
          'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
          'focus:ring-0 focus-visible:ring-0',
          className
        )
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea
}
