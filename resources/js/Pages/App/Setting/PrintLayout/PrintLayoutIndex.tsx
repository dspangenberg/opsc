import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'

import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import type { PageProps } from '@/Types'
import { columns } from './PrintLayoutIndexColumns'

interface PrintLayoutIndexPageProps extends PageProps {
  layouts: App.Data.Paginated.PaginationMeta<App.Data.PrintLayoutData[]>
}

const PrintLayoutIndex: React.FC<PrintLayoutIndexPageProps> = ({ layouts }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.PrintLayoutData[]>([])

  const breadcrumbs = useMemo(
    () => [
      { title: 'Einstellungen', url: route('app.setting') },
      { title: 'Drucksystem', url: route('app.setting.printing-system') },
      { title: 'Layouts' }
    ],
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
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => {
    return <Pagination data={layouts} />
  }, [layouts])

  return (
    <PageContainer
      title="Layouts"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={layouts.data}
        footer={footer}
        itemName="Layouts"
      />
    </PageContainer>
  )
}

export default PrintLayoutIndex
