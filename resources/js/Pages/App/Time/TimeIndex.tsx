import type * as React from 'react'
import { useCallback, useEffect, useId, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
// import { useModalStack } from '@inertiaui/modal-react' // Temporarily disabled
import {
  Add01Icon,
  PrinterIcon,
  Sorting05Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Button, Toolbar, ToolbarButton, FormSelect } from '@dspangenberg/twcui'
import { columns } from './TimeIndexColumns'
import type { PageProps } from '@/Types'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { getYear } from "date-fns";
import { router } from '@inertiajs/core'
import { debounce } from 'lodash'

export interface TimeGroupedEntries {
  entries: {
    [key: number]: App.Data.TimeData[]
  },
}

export interface TimeGroupedByDate {
  [key: string]: {
    entries: TimeGroupedEntries,
    date: string,
    formatedDate: string
    sum: number
  }
}

interface TimeIndexProps extends PageProps {
  times: App.Data.Paginated.PaginationMeta<App.Data.TimeData[]>
  grouped_times: TimeGroupedByDate[]
}

const TimeIndex: React.FC = () => {
  const times = usePage<TimeIndexProps>().props.times

  // const { visitModal } = useModalStack() // Temporarily disabled

  const breadcrumbs = useMemo(() => [{ title: 'Kontakte', route: route('app.contact.index') }], [])

  const toolbar = useMemo(
    () => (
      <Toolbar className="bg-background border-0 shadow-none">
        <ToolbarButton variant="default" icon={Add01Icon} title="Rechnung hinzufügen" />
        <ToolbarButton icon={PrinterIcon} />
        <ToolbarButton icon={MoreVerticalCircle01Icon} />
      </Toolbar>
    ),
    []
  )

  const id = useId()

  const header = useMemo(
    () => (
      <div className="flex flex-col py-0 rounded-t-md">
        <div className="flex-none space-x-2 p-2 flex items-center">
          <div className="group relative min-w-64">
            <Select>
              <SelectTrigger id={id} className="bg-white">
                <SelectValue placeholder="Gespeicherte Views" className="bg-white" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Abbrechenbare Zeiten</SelectItem>
                <SelectItem value="2">Next.js</SelectItem>
                <SelectItem value="3">Astro</SelectItem>
                <SelectItem value="4">Gatsby</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="sm" icon={Sorting05Icon} title="Filter + Sortierung" />
        </div>
      </div>
    ),
    [id]
  )

  const footer = useMemo(() => <Pagination data={times} />, [times])

  return (
    <PageContainer
      title="Zeiterfassung"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="overflow-hidden flex"
      toolbar={toolbar}
      header={
        <div className="flex gap-2 items-center flex-1">
          <div className="flex flex-none gap-1 text-xl font-bold items-center">
            Zeiterfassung&nbsp;
          </div>
        </div>
      }
    >
        <DataTable columns={columns} data={times.data} footer={footer} header={header} itemName="Zeiten"/>
    </PageContainer>
  )
}

export default TimeIndex
