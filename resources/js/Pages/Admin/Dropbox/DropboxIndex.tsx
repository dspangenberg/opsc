import { Add01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { columns } from './DropboxIndexColumns'

interface UserIndexPageProps extends PageProps {
  dropboxes: App.Data.Paginated.PaginationMeta<App.Data.DropboxData[]>
}

const DropboxIndex: React.FC<UserIndexPageProps> = ({ dropboxes }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.DropboxData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'Admin' }, { title: 'E-Mail-Accounts' }], [])

  const handleAddDropbox = () => {
    router.visit(route('admin.dropbox.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="E-Mail-Dropbox hinzufügen"
          onClick={handleAddDropbox}
        />
      </Toolbar>
    ),
    []
  )

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={dropboxes} />
  }, [dropboxes])

  return (
    <PageContainer
      title="E-Mail-Dropboxen"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        onSelectedRowsChange={setSelectedRows}
        data={dropboxes.data}
        footer={footer}
        itemName="E-Mail-Konten"
      />
    </PageContainer>
  )
}

export default DropboxIndex
