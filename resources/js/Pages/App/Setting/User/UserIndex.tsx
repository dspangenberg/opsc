import { Add01Icon, Tick01Icon } from '@hugeicons/core-free-icons'
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
import { columns } from './UserIndexColumns'

interface UserIndexPageProps extends PageProps {
  users: App.Data.Paginated.PaginationMeta<App.Data.UserData[]>
}

const UserIndex: React.FC<UserIndexPageProps> = ({ users }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.UserData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'System' }, { title: 'Benuterkonten' }], [])

  const handleUserAdd = () => {
    router.visit(route('app.setting.system.user.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neues Benutzerkonto"
          onClick={handleUserAdd}
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
        <Button variant="ghost" size="auto" icon={Tick01Icon} title="als bestätigt markieren" />
        <div className="flex-1 text-right font-medium text-sm">x</div>
      </Toolbar>
    )
  }, [selectedRows.length])

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={users} />
  }, [users])

  return (
    <PageContainer
      title="Benutzerkonten"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={users.data}
        footer={footer}
        itemName="Benutzerkonten"
      />
    </PageContainer>
  )
}

export default UserIndex
