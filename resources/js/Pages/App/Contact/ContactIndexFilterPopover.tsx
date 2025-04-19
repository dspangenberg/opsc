import { useCallback, useMemo } from 'react'
import type * as React from 'react'
import { usePage } from '@inertiajs/react'
import { useModalStack } from '@inertiaui/modal-react'
import {
  FolderViewIcon,
  FolderManagementIcon,
  Add01Icon,
  InboxIcon,
  FilterIcon,
  MoreVerticalCircle01Icon,
  Sorting05Icon
} from '@hugeicons/core-free-icons'
import { NavTabs, NavTabsTab } from '@/Components/NavTabs'
import { DataTable } from '@/Components/DataTable'
import { EmptyState } from '@/Components/EmptyState'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import { columns } from './ContactIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { HugeiconsIcon } from '@hugeicons/react'
import { useId } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'
import { Badge } from '@/Components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'

export const ContactIndexFilterPopover: React.FC = () => {
  const id = useId()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" icon={FilterIcon}>
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-96">
        xx
      </PopoverContent>
    </Popover>
  )
}
