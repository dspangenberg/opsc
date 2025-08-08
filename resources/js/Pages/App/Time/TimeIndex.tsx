import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/Components/ui/select'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import type { PageProps } from '@/Types'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { minutesToHoursExtended } from '@/Lib/DateHelper'
import { Add01Icon, FileDownloadIcon, PrinterIcon, Sorting05Icon } from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { columns } from './TimeIndexColumns'

export interface TimeGroupedEntries {
  entries: {
    [key: number]: App.Data.TimeData[]
  }
}

export interface TimeGroupedByDate {
  [key: string]: {
    entries: TimeGroupedEntries
    date: string
    formatedDate: string
    sum: number
  }
}

interface TimeIndexProps extends PageProps {
  times: App.Data.Paginated.PaginationMeta<App.Data.TimeData[]>
  groupedByDate: TimeGroupedByDate[]
}

const TimeIndex: React.FC = () => {
  const times = usePage<TimeIndexProps>().props.times
  const grouped_times = usePage<TimeIndexProps>().props.groupedByDate
  const [selectedRows, setSelectedRows] = useState<App.Data.TimeData[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)

  const breadcrumbs = useMemo(() => [{ title: 'Zeiterfassung' }], [])
  const handleTimeCreateClicked = () => {
    router.visit(
      route('app.time.create', {
        _query: {
          view: 'all'
        }
      })
    )
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neue Rechnung"
          onPress={handleTimeCreateClicked}
        />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" disabled={true} />
      </Toolbar>
    ),
    []
  )

  const header = useMemo(
    () => (
      <div className="flex flex-col rounded-t-md py-0">
        <div className="flex flex-none items-center space-x-2 p-2">
          <div className="group relative min-w-64">
            <Select>
              <SelectTrigger className="bg-white">
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
    []
  )

  // Derive total selected minutes from selectedRows
  const selectedMins = useMemo(() => sumBy(selectedRows, 'mins'), [selectedRows])

  const actionBar = useMemo(() => {
    return (
      <Toolbar variant="secondary" className="px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <Button variant="ghost" size="auto" icon={FileDownloadIcon} title="Herunterladen" />
        <div className="flex-1 text-right font-medium text-sm">
          {minutesToHoursExtended(selectedMins)}
        </div>
      </Toolbar>
    )
  }, [selectedMins, selectedRows.length])

  const currentRoute = route().current()

  const tabs = useMemo(
    () => (
      <Tabs variant="underlined" defaultSelectedKey={currentRoute}>
        <TabList aria-label="Ansicht">
          <Tab id="app.time.my-week" href={route('app.time.my-week', {}, false)}>
            Meine Woche
          </Tab>
          <Tab id="app.time.index" href={route('app.time.index')}>
            Alle Zeiten
          </Tab>
        </TabList>
      </Tabs>
    ),
    [currentRoute]
  )

  const footer = useMemo(() => <Pagination data={times} />, [times])

  return (
    <PageContainer
      title="Zeiterfassung"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
      tabs={tabs}
      header={
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-none items-center gap-1 font-bold text-xl">
            Zeiterfassung&nbsp;
          </div>
        </div>
      }
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={times.data}
        footer={footer}
        header={header}
        itemName="Zeiten"
      />
    </PageContainer>
  )
}

export default TimeIndex
