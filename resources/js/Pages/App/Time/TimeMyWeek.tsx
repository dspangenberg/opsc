import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { StatsField } from '@/Components/StatsField'
import { BorderedBox } from '@/Components/twcui/bordered-box'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import { minutesToHoursExtended } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'
import { Button, Toolbar, ToolbarButton } from '@dspangenberg/twcui'
import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  MoreVerticalCircle01Icon,
  PrinterIcon
} from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useId, useMemo } from 'react'
import { columns } from './TimeIndexColumns'

export interface TimeGroupedEntries {
  entries: {
    [key: number]: App.Data.TimeData[]
  }
}

// Einzelner Tages-Eintrag
export interface TimeGroupedByDate {
  [key: string]: {
    entries: App.Data.TimeData[]
    date: string
    formatedDate: string
    sum: number
    weekday: number
  }
}

// Neues Aggregat mit Summen (Controller gibt dieses Schema zurück)
export interface TimeWeekGrouping {
  entries: TimeGroupedByDate
  sum: number
  sumByWeekday: number[] // 0..6 => Minuten pro Wochentag
}

interface TimeIndexProps extends PageProps {
  times: App.Data.Paginated.PaginationMeta<App.Data.TimeData[]>
  week: number
  startDate: string
  endDate: string
  groupedByDate: TimeWeekGrouping
}

const TimeIndex: React.FC = () => {
  const times = usePage<TimeIndexProps>().props.times
  const grouped_times = usePage<TimeIndexProps>().props.groupedByDate
  const startDate = usePage<TimeIndexProps>().props.startDate
  const endDate = usePage<TimeIndexProps>().props.endDate
  const week = usePage<TimeIndexProps>().props.week

  const breadcrumbs = useMemo(
    () => [{ title: 'Zeiterfassung', url: route('app.time.index') }, { title: 'Meine Woche' }],
    []
  )

  const handleTimeCreateClicked = () => {
    router.visit(
      route('app.time.create', {
        _query: {
          view: 'week'
        }
      })
    )
  }

  const toolbar = useMemo(
    () => (
      <Toolbar className="border-0 bg-background shadow-none">
        <ToolbarButton
          variant="default"
          icon={Add01Icon}
          title="Eintrag hinzufügen"
          onClick={handleTimeCreateClicked}
        />
        <ToolbarButton icon={PrinterIcon} />
        <ToolbarButton icon={MoreVerticalCircle01Icon} />
      </Toolbar>
    ),
    []
  )

  const id = useId()

  const header = useMemo(
    () => (
      <div className="flex flex-col space-y-3 rounded-t-md py-3">
        <div className="flex flex-none items-center gap-1 font-bold text-sm">
          <Button variant="ghost" size="icon" icon={ArrowLeft01Icon} />
          {week}. KW &mdash; {startDate} - {endDate}
          <Button variant="ghost" size="icon" icon={ArrowRight01Icon} />
        </div>
        <BorderedBox className="mx-auto mb-3 flex-none">
          <div className="mx-auto flex justify-center gap-4 divide-y bg-white px-2 py-2.5 lg:divide-x lg:divide-y-0">
            {(() => {
              const weekdayOrder = [1, 2, 3, 4, 5, 6, 0] // Mo..So (Carbon: 0=So, 1=Mo, ...)
              const weekdayLabelsDe = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
              return weekdayOrder.map((weekday, idx) => (
                <StatsField
                  key={`weekday-${weekday}`}
                  label={weekdayLabelsDe[idx]}
                  value={minutesToHoursExtended(grouped_times.sumByWeekday[weekday] ?? 0)}
                />
              ))
            })()}
            <StatsField label="Woche" value={minutesToHoursExtended(grouped_times.sum)} />
          </div>
        </BorderedBox>
      </div>
    ),
    [grouped_times.sum, week, startDate, endDate]
  )

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
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
      title="Meine Woche"
    >
      <DataTable
        columns={columns}
        data={times.data}
        footer={footer}
        header={header}
        itemName="Zeiten"
      />
    </PageContainer>
  )
}

export default TimeIndex
