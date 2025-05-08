
import type * as React from 'react'
import {
  FilterIcon
} from '@hugeicons/core-free-icons'
import { Button, FormLabel, FormSelect, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { useId } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'



export const ContactIndexFilterPopover: React.FC = () => {
  const id = useId()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" icon={FilterIcon}>
          Kontakte filtern
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-96">
        <div className="flex gap-2">
          xxxx
        </div>
      </PopoverContent>
    </Popover>
  )
}
