import {
  Add01Icon,
  FileDownloadIcon,
  FilterIcon,
  PrinterIcon,
  Sorting05Icon
} from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import { sumBy } from 'lodash'
import type * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { ComboBox } from '@/Components/twc-ui/combo-box'
import { PdfViewer } from '@/Components/twc-ui/pdf-viewer'
import { ToggleButton } from '@/Components/twc-ui/toggle-button'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import { minutesToHoursExtended } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'
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
  const projects = usePage<TimeIndexProps>().props.projects
  const currentFilters = usePage<TimeIndexProps>().props.currentFilters
  const [selectedRows, setSelectedRows] = useState<App.Data.TimeData[]>([])
  const [showFilter, setShowFilter] = useState<boolean>(false)

  // Verwende currentFilters als Ausgangswert
  const [selectedProject, setSelectedProject] = useState<number>(currentFilters.project_id)

  const selectedMins = useMemo(() => sumBy(selectedRows, 'mins'), [selectedRows])

  const breadcrumbs = useMemo(() => [{ title: 'Zeiterfassung' }], [])

  const onShowPdf = async () => {
    await PdfViewer.call({
      filename: 'proof.pdf',
      file: route('app.time.pdf', {
        _query: {
          filter: {
            project_id: selectedProject
          }
        }
      })
    })
  }

  const handleTimeCreateClicked = useCallback(() => {
    router.visit(
      route('app.time.create', {
        _query: {
          view: 'all'
        }
      })
    )
  }, [])

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
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" onClick={() => onShowPdf()} />
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

  const filterBar = useMemo(() => {
    if (!showFilter) {
      return null
    }
    return (
      <Toolbar variant="secondary" className="px-4 pt-2 pb-3">
        <ComboBox<App.Data.ProjectData>
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
      </Toolbar>
    )
  }, [showFilter, selectedProject, handleProjectChange, projects, handleFilterApplyClicked])

  const header = useMemo(
    () => (
      <div className="flex flex-col rounded-t-md py-1.5">
        <Toolbar variant="secondary">
          <ToggleButton
            icon={FilterIcon}
            tooltip="Filter ein- /ausblenden"
            isSelected={showFilter}
            onChange={setShowFilter}
          />
        </Toolbar>
      </div>
    ),
    [showFilter] // Alle Dependencies hinzugefügt
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

  const footer = useMemo(() => <Pagination data={times} />, [times])

  return (
    <PageContainer
      title="Zeiterfassung"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex flex-1 overflow-hidden"
      toolbar={toolbar}
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
        filterBar={filterBar}
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
