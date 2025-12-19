import { cva, type VariantProps } from 'class-variance-authority'
import { Check, ChevronRight, Dot } from 'lucide-react'
import type * as React from 'react'
import {
  Header as AriaHeader,
  Keyboard as AriaKeyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuTrigger as AriaMenuTrigger,
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
  SubmenuTrigger as AriaSubmenuTrigger,
  composeRenderProps,
  type PopoverProps
} from 'react-aria-components'
import { cn } from '@/Lib/utils'
import { Icon, type IconType } from './icon'
import { ListBoxCollection, ListBoxSection } from './list-box'
import { SelectPopover } from './select'

const MenuTrigger = AriaMenuTrigger

const MenuSubTrigger = AriaSubmenuTrigger

const MenuSection = ListBoxSection

const MenuCollection = ListBoxCollection

function MenuPopover({ className, ...props }: PopoverProps) {
  return (
    <SelectPopover
      className={composeRenderProps(className, className => cn('w-auto', className))}
      {...props}
    />
  )
}

const Menu = <T extends object>({ className, ...props }: AriaMenuProps<T>) => (
  <AriaMenu
    className={cn(
      'max-h-[inherit] overflow-auto rounded-md p-1 outline-0 [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]',
      className
    )}
    {...props}
  />
)

const menuItemVariants = cva(
  [
    'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
    /* Disabled */
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    /* Selection Mode */
    'data-[selection-mode]:pl-8'
  ],
  {
    variants: {
      variant: {
        default: ['data-[focused]:bg-accent data-[focused]:text-accent-foreground'],
        destructive: [
          'data-[focused]:text-destructive data-[focused]:text-destructive-foreground data-[focused]:bg-destructive/10'
        ]
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

interface MenuItemProps extends AriaMenuItemProps, VariantProps<typeof menuItemVariants> {
  icon?: IconType
  iconClassName?: string
  separator?: boolean
  title?: string
  ellipsis?: boolean
  shortcut?: string
  isDisabled?: boolean
}

interface BaseMenuItemProps extends AriaMenuItemProps, VariantProps<typeof menuItemVariants> {}

const BaseMenuItem = ({ children, variant, ...props }: BaseMenuItemProps) => (
  <AriaMenuItem
    className={composeRenderProps(props.className, className =>
      cn(menuItemVariants({ variant }), className)
    )}
    {...props}
  >
    {children}
  </AriaMenuItem>
)
const MenuItem = ({
  children,
  className,
  icon,
  isDisabled,
  separator = false,
  shortcut = '',
  title,
  ellipsis = false,
  variant,
  ...props
}: MenuItemProps) => (
  <>
    <AriaMenuItem
      id={props.id}
      textValue={props.textValue || (typeof children === 'string' ? children : undefined)}
      isDisabled={isDisabled}
      className={composeRenderProps(className, className =>
        cn(menuItemVariants({ variant }), className)
      )}
      {...props}
    >
      {composeRenderProps(children, (_children, renderProps) => (
        <div className="flex flex-1 items-center gap-2">
          {icon ? <Icon icon={icon} className="size-4 flex-none" /> : <span className="size-4" />}
          <span className="absolute left-2 flex size-4 items-center justify-center">
            {renderProps.isSelected && (
              <>
                {renderProps.selectionMode === 'single' && (
                  <Icon icon={Dot} className="size-4 fill-current text-primary" />
                )}
                {renderProps.selectionMode === 'multiple' && (
                  <Icon icon={Check} className="size-4" />
                )}
              </>
            )}
          </span>

          <span className="flex-1">
            {title}
            {!!ellipsis && <span> &hellip;</span>}
          </span>

          {!!shortcut && <MenuKeyboard>{shortcut}</MenuKeyboard>}

          {renderProps.hasSubmenu && <Icon icon={ChevronRight} className="size-4" />}
        </div>
      ))}
    </AriaMenuItem>
    {!!separator && <MenuSeparator />}
  </>
)

interface MenuHeaderProps extends React.ComponentProps<typeof AriaHeader> {
  inset?: boolean
  separator?: boolean
}

const MenuHeader = ({ className, inset, separator = true, ...props }: MenuHeaderProps) => (
  <AriaHeader
    className={cn(
      'px-3 py-1.5 font-semibold text-sm',
      inset && 'pl-8',
      separator && '-mx-1 mb-1 border-b border-b-border pb-2.5',
      className
    )}
    {...props}
  />
)

const MenuSeparator = ({ className, ...props }: AriaSeparatorProps) => (
  <AriaSeparator className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
)

const MenuKeyboard = ({ className, ...props }: React.ComponentProps<typeof AriaKeyboard>) => {
  return (
    <AriaKeyboard
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  )
}

export {
  MenuTrigger,
  Menu,
  MenuPopover,
  MenuItem,
  MenuHeader,
  MenuSeparator,
  MenuKeyboard,
  MenuSection,
  MenuSubTrigger,
  MenuCollection,
  BaseMenuItem
}
export type { MenuHeaderProps, MenuItemProps, AriaMenuProps }
