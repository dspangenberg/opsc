import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Tab, TabList, Tabs } from '@/Components/ui/twc-ui/tabs'
import type { PageProps } from '@/Types'
import { useQueryBuilder } from '@cgarciagarcia/react-query-builder'

import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/twc-ui/button'
import { FormlessCombobox } from '@/Components/ui/twc-ui/combo-box'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { minutesToHoursExtended } from '@/Lib/DateHelper'
import { Add01Icon, FileDownloadIcon, PrinterIcon, Sorting05Icon } from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
  projects: App.Data.ProjectData[]
  currentFilters: {
    project_id: number
  }
}

const TimeIndex: React.FC = () => {
  const times = usePage<TimeIndexProps>().props.times
  const grouped_times = usePage<TimeIndexProps>().props.groupedByDate
  const projects = usePage<TimeIndexProps>().props.projects
  const currentFilters = usePage<TimeIndexProps>().props.currentFilters

  const [selectedRows, setSelectedRows] = useState<App.Data.TimeData[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)

  // Verwende currentFilters als Ausgangswert
  const [selectedProject, setSelectedProject] = useState<number>(currentFilters.project_id)

  const selectedMins = useMemo(() => sumBy(selectedRows, 'mins'), [selectedRows])

  const breadcrumbs = useMemo(() => [{ title: 'Zeiterfassung' }], [])

  const handleTimeCreateClicked = useCallback(() => {
    router.visit(
      route('app.time.create', {
        _query: {
          view: 'all'
        }
      })
    )
  }, [])

  const builder = useQueryBuilder()

  useEffect(() => {
    console.log(selectedProject)
    builder.clearFilters().filter('project_id', selectedProject)
  }, [selectedProject, builder])

  const handleProjectChange = useCallback((value: unknown) => {
    setSelectedProject(Number(value))
  }, [])

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
    [handleTimeCreateClicked]
  )

  const handleFilterApplyClicked = useCallback(() => {
    const queryParams: Record<string, unknown> = {}

    if (selectedProject > 0) {
      queryParams['filter[project_id]'] = selectedProject
    }

    router.visit(route('app.time.index', { _query: queryParams }))
  }, [selectedProject])

  const header = useMemo(
    () => (
      <div className="flex flex-col rounded-t-md py-0">
        <div className="flex flex-none items-center space-x-2 p-2">
          <div className="group relative min-w-64">
            <FormlessCombobox<App.Data.ProjectData>
              aria-label="View"
              className="w-48 bg-background"
              name="view"
              value={selectedProject}
              onChange={handleProjectChange}
              items={projects}
            />
            <Button
              variant="ghost"
              size="sm"
              icon={Sorting05Icon}
              title="Filter + Sortierung"
              onClick={handleFilterApplyClicked}
            />
          </div>
          <Button variant="ghost" size="sm" icon={Sorting05Icon} title="Filter + Sortierung" />
        </div>
      </div>
    ),
    [selectedProject, handleProjectChange, projects, handleFilterApplyClicked] // Alle Dependencies hinzugefügt
  )

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
