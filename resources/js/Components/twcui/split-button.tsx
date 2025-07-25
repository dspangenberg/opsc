import type * as React from "react"
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"
import type { VariantProps } from "class-variance-authority"
import {
  Header as AriaHeader,
  Keyboard as AriaKeyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
  SubmenuTrigger as AriaSubmenuTrigger,
  composeRenderProps,
  Group,
  type PopoverProps,
  Pressable,
} from "react-aria-components"
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from "@/Lib/utils"
import { Button, type buttonVariants } from "@/Components/ui/twc-ui/button"
import { ListBoxCollection, ListBoxSection } from "@/Components/jolly-ui/list-box"
import { SelectPopover } from "@/Components/jolly-ui/select"

export type IconSvgElement = readonly (readonly [
  string,
  {
    readonly [key: string]: string | number
  }
])[]

const MenuTrigger = AriaMenuTrigger

const MenuSubTrigger = AriaSubmenuTrigger

const MenuSection = ListBoxSection

const MenuCollection = ListBoxCollection

function MenuPopover({ className, ...props }: PopoverProps) {
  return (
    <SelectPopover
      className={composeRenderProps(className, (className) =>
        cn("w-auto", className)
      )}
      {...props}
    />
  )
}

const Menu = <T extends object>({ className, ...props }: AriaMenuProps<T>) => (
  <AriaMenu
    className={cn(
      "max-h-[inherit] overflow-auto rounded-md p-1 outline-0 [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))]",
      className
    )}
    {...props}
  />
)

interface MenuItemProps extends AriaMenuItemProps {
  icon?: IconSvgElement
  iconClassName?: string
  separator?: boolean
  title?: string
  ellipsis?: boolean
  shortcut?: string
  disabled?: boolean
}


const MenuItem = ({ children, className, icon, disabled, separator = false, shortcut = '', title, ellipsis=false, ...props }: MenuItemProps) => (
  <>
  <AriaMenuItem
    id={props.id}
    textValue={
      props.textValue || (typeof children === "string" ? children : undefined)
    }
    isDisabled={disabled}
    className={composeRenderProps(className, (className) =>
      cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        /* Disabled */
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        /* Focused */
        "data-[focused]:bg-accent data-[focused]:text-accent-foreground ",
        /* Selection Mode */
        "data-[selection-mode]:pl-8",
        className
      )
    )}
    {...props}
  >
    {composeRenderProps(children, (children, renderProps) => (
      <div className="flex items-center gap-2 flex-1">
        { icon ? ( <HugeiconsIcon icon={icon} className="flex-none size-4 text-foreground/80" />) : (<span className="size-4" />)}
        <span className="absolute left-2 flex size-4 items-center justify-center">
          {renderProps.isSelected && (
            <>
              {renderProps.selectionMode === "single" && (
                <DotFilledIcon className="size-4 fill-current" />
              )}
              {renderProps.selectionMode === "multiple" && (
                <CheckIcon className="size-4" />
              )}
            </>
          )}
        </span>

        <span className="flex-1">
        {title}{!!ellipsis && <span>&hellip;</span>}
        </span>

        {!!shortcut && (
          <MenuKeyboard>{shortcut}</MenuKeyboard>
        )}

        {renderProps.hasSubmenu && (
          <ChevronRightIcon className="ml-auto size-4" />
        )}
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

const MenuHeader = ({
  className,
  inset,
  separator = true,
  ...props
}: MenuHeaderProps) => (
  <AriaHeader
    className={cn(
      "px-3 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      separator && "-mx-1 mb-1 border-b border-b-border pb-2.5",
      className
    )}
    {...props}
  />
)

const MenuSeparator = ({ className, ...props }: AriaSeparatorProps) => (
  <AriaSeparator
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
)

const MenuKeyboard = ({
  className,
  ...props
}: React.ComponentProps<typeof AriaKeyboard>) => {
  return (
    <AriaKeyboard
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}

interface DropdownMenuProps<T>
  extends AriaMenuProps<T>,
    VariantProps<typeof buttonVariants>,
    Omit<AriaMenuTriggerProps, "children"> {
  title?: string
  icon?: IconSvgElement
  placement?: PopoverProps['placement']
  selectionMode?: AriaMenuProps<T>['selectionMode']
  selectedKeys?: AriaMenuProps<T>['selectedKeys']
  onSelectionChange?: AriaMenuProps<T>['onSelectionChange']
  onClick?: () => void
}
function SplitButton<T extends object>({
  title,
  children,
  variant,
  placement = 'bottom right',
  selectionMode = undefined,
  selectedKeys = undefined,
  onSelectionChange,
  size,
  onClick,
  ...props
}: DropdownMenuProps<T>) {
  return (
    <Group className="flex items-center group focus-within:ring-ring/20 focus-within:ring-[3px] rounded-md border border-input">
      <Button variant={variant} size={size} icon={props.icon} title={title} onClick={onClick} className="border-0 border-r !border-r-transparent group-hover:!border-r-border !rounded-r-none focus-visible:ring-0" />
    <MenuTrigger {...props}>

        <Pressable aria-label="Open menu">
          <div className="m-1 mr-3 ml-2" >
            <ChevronDownIcon className="size-4 text-foreground/80 group-hover:text-foreground/90" />
          </div>
        </Pressable>


      <MenuPopover className="min-w-[--trigger-width]" placement={placement} >
        <Menu selectionMode={selectionMode} selectedKeys={selectedKeys} onSelectionChange={onSelectionChange} {...props}>{children}</Menu>
      </MenuPopover>
    </MenuTrigger>
    </Group>
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
  SplitButton,
}
export type { MenuHeaderProps, DropdownMenuProps }
