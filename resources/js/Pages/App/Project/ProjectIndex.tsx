import { Add01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import type { PageProps } from '@/Types'
import { columns } from './ProjectIndexColumns'

interface ProjectIndexPageProps extends PageProps {
  projects: App.Data.Paginated.PaginationMeta<App.Data.ProjectData[]>
}

const ProjectIndex: React.FC<ProjectIndexPageProps> = ({ projects }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.ProjectData[]>([])

  const breadcrumbs = [{ title: 'Projekt' }]

  const handleProjectAdd = () => {
    router.get(route('app.project.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neues Projekt hinzufügen"
          onClick={handleProjectAdd}
        />
      </Toolbar>
    ),
    []
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
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={projects} />
  }, [projects])

  return (
    <PageContainer
      title="Projekte"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={projects.data}
        footer={footer}
        itemName="Projekte"
      />
    </PageContainer>
  )
}

export default ProjectIndex
