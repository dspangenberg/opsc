import {
  Add01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  CoinsEuroIcon,
  PrinterIcon
} from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { StatsField } from '@/Components/StatsField'
import { Button } from '@/Components/twc-ui/button'
import { ScrollCard } from '@/Components/twc-ui/scroll-card'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { getNextWeek, getPrevWeek, minutesToHoursExtended } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'
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
  times: App.Data.TimeData[]
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

  const [selectedRows, setSelectedRows] = useState<App.Data.TimeData[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const selectedMins = useMemo(() => sumBy(selectedRows, 'mins'), [selectedRows])

  const breadcrumbs = useMemo(
    () => [{ title: 'Zeiterfassung', url: route('app.time.index') }, { title: 'Meine Woche' }],
    []
  )

  const handleTimeCreateClicked = () => {
    router.visit(
      route('app.time.create', {
        _query: {
          view: 'my-week'
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
          title="Eintrag hinzufügen"
          onPress={handleTimeCreateClicked}
        />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" disabled={true} />
      </Toolbar>
    ),
    []
  )

  const actionBar = useMemo(() => {
    return (
      <Toolbar variant="secondary" className="items-center px-4 pt-2">
        <div className="self-center text-sm">
          <Badge variant="outline" className="mr-1.5 bg-background">
            {selectedRows.length}
          </Badge>
          ausgewählte Datensätze
        </div>
        <Button variant="ghost" size="auto" icon={CoinsEuroIcon} title="abrechnen" />
        <div className="flex-1 pr-16 text-right font-medium text-sm">
          {minutesToHoursExtended(selectedMins)}
        </div>
      </Toolbar>
    )
  }, [selectedMins, selectedRows.length])

  const handlePrevWeekClicked = () => {
    const date = getPrevWeek(startDate)
    router.get(
      route('app.time.my-week', {
        _query: {
          view: 'my-week',
          start_date: date
        }
      })
    )
  }

  const handleNextWeekClicked = () => {
    const date = getNextWeek(startDate)
    router.get(
      route('app.time.my-week', {
        _query: {
          view: 'my-week',
          start_date: date
        }
      })
    )
  }

  const handleCurrentWeekClicked = () => {
    router.get(
      route('app.time.my-week', {
        _query: { view: 'my-week' }
      })
    )
  }

  const isNextWeekDisabled = useMemo(() => {
    const date = getNextWeek(startDate, false)
    return date > new Date()
  }, [startDate])

  const header = useMemo(
    () => (
      <div className="flex flex-col space-y-3 rounded-t-md py-3">
        <div className="flex flex-none items-center gap-1 font-bold text-sm">
          <Button
            variant="ghost"
            size="icon"
            tooltip="Vorherige Woche"
            icon={ArrowLeft01Icon}
            onClick={handlePrevWeekClicked}
          />
          {week}. KW &mdash; {startDate} - {endDate}
          <Button
            variant="ghost"
            size="icon"
            icon={ArrowRight01Icon}
            tooltip="Nächste Woche"
            onClick={handleNextWeekClicked}
            disabled={isNextWeekDisabled}
          />
          <Button
            variant="ghost"
            size="icon"
            icon={Calendar01Icon}
            tooltip="Aktuelle Woche"
            onClick={handleCurrentWeekClicked}
          />
        </div>
        <ScrollCard className="mx-auto mb-3 flex-none">
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
        </ScrollCard>
      </div>
    ),
    [grouped_times.sum, week, startDate, endDate, isNextWeekDisabled]
  )

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
        data={times}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        header={header}
        itemName="Zeiten"
      />
    </PageContainer>
  )
}

export default TimeIndex
