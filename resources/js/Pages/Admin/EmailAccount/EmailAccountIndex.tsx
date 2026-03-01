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
import { columns } from './EmailAccountIndexColumns'

interface UserIndexPageProps extends PageProps {
  email_accounts: App.Data.Paginated.PaginationMeta<App.Data.EmailAccountData[]>
}

const EmailAccountIndex: React.FC<UserIndexPageProps> = ({ email_accounts }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.EmailAccountData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'Admin' }, { title: 'E-Mail-Accounts' }], [])

  const handleUserAdd = () => {
    router.visit(route('admin.email-account.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="E-Mail-Account hinzufügen"
          onClick={handleUserAdd}
        />
      </Toolbar>
    ),
    []
  )

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={email_accounts} />
  }, [email_accounts])

  return (
    <PageContainer
      title="E-Mail-Konten"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        onSelectedRowsChange={setSelectedRows}
        data={email_accounts.data}
        footer={footer}
        itemName="E-Mail-Konten"
      />
    </PageContainer>
  )
}

export default EmailAccountIndex
