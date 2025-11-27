
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import type { PageProps } from '@/Types'
import { columns } from './TimeIndexBillableProjectColumns'

interface TimeIndexProps extends PageProps {
  billableProjects: App.Data.BillableProjectData[]
}

const TimeBillableIndex: React.FC = () => {
  const billableProjects = usePage<TimeIndexProps>().props.billableProjects
  const breadcrumbs = useMemo(() => [{ title: 'Zeiterfassung' }], [])

  return (
    <PageContainer
      title="Abrechenbare Projekte"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex flex-1 overflow-hidden"
    >
      <DataTable columns={columns} data={billableProjects} itemName="Zeiten" />
    </PageContainer>
  )
}

export default TimeBillableIndex
