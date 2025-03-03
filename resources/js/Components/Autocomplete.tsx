import { FormInput as Input } from '@/Components/FormInput'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/Components/ui/command'
import { Popover, PopoverAnchor, PopoverContent } from '@/Components/ui/popover'
import { Skeleton } from '@/Components/ui/skeleton'
import { cn, focusWithinInput } from '@/Lib/utils'
import { Command as CommandPrimitive } from 'cmdk'
import { Check } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'

export interface Props<T extends string> {
  selectedValue: T
  onSelectedValueChange: (value: T) => void
  searchValue: string
  onSearchValueChange: (value: string) => void
  items: { value: T; label: string }[]
  isLoading?: boolean
  autoFocus?: boolean
  emptyMessage?: string
  placeholder?: string
}

export function AutoComplete<T extends string>({
  autoFocus = false,
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = 'No items.',
  placeholder = 'Search...'
}: Props<T>) {
  const [open, setOpen] = useState(false)

  const labels = useMemo(
    () =>
      items.reduce<Record<T, string>>(
        (acc, item) => {
          acc[item.value] = item.label
          return acc
        },
        {} as Record<T, string>
      ),
    [items]
  )

  const reset = () => {
    onSelectedValueChange('' as T)
    onSearchValueChange('')
  }

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.relatedTarget?.hasAttribute('cmdk-list') && labels[selectedValue] !== searchValue) {
      // reset()
    }
  }

  const onSelectItem = (inputValue: T) => {
    if (inputValue === selectedValue) {
      // Do nothing if the same item is selected
    } else {
      onSelectedValueChange(inputValue)
      onSearchValueChange(labels[inputValue])
    }
    setOpen(false)
  }

  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className={cn(focusWithinInput, 'rounded')}>
          <PopoverAnchor asChild>
            <CommandPrimitive.Input
              asChild
              value={searchValue}
              onValueChange={onSearchValueChange}
              onKeyDown={e => { setOpen(e.key !== 'Escape'); }}
              onMouseDown={() => { setOpen(open => !!searchValue || !open); }}
              onBlur={onInputBlur}
            >
              <Input placeholder={placeholder} autoFocus={autoFocus} />
            </CommandPrimitive.Input>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={e => e.preventDefault()}
            onInteractOutside={e => {
              if (e.target instanceof Element && e.target.hasAttribute('cmdk-input')) {
                e.preventDefault()
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={e => e.preventDefault()}
                      onSelect={(value) => onSelectItem(value as T)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValue === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading ? <CommandEmpty>{emptyMessage ?? 'No items.'}</CommandEmpty> : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  )
}
