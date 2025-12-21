import { ChevronDown } from 'lucide-react'
import { Group } from 'react-aria-components'
import { Button } from './button'
import { DropdownButton, type DropdownButtonProps } from './dropdown-button'

function SplitButton<T extends object>({
  title,
  children,
  variant,
  placement = 'bottom right',
  selectionMode = undefined,
  selectedKeys = undefined,
  onSelectionChange,
  size = 'default',
  onClick,
  ...props
}: DropdownButtonProps<T>) {
  return (
    <Group className="group flex items-center rounded-md border border-input focus-within:ring-[3px] focus-within:ring-ring/20">
      <Button
        variant={variant}
        size={size}
        icon={props.icon}
        title={title}
        onClick={onClick}
        className="rounded-r-none! border-0 border-r border-r-transparent! focus-visible:ring-0 group-hover:border-r-border!"
      />
      <DropdownButton
        variant={variant}
        size="icon"
        icon={ChevronDown}
        className="rounded-l-none border-l! border-y-0 border-r-0"
      >
        {children}
      </DropdownButton>
    </Group>
  )
}

export { SplitButton }
