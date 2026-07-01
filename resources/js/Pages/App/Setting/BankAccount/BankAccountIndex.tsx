import { Add01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { Button } from '@/Components/twc-ui/button'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { columns } from './BankAccountIndexColumns'

interface BankAccountIndexPageProps extends PageProps {
  bank_accounts: App.Data.Paginated.PaginationMeta<App.Data.BankAccountData[]>
}

const BankAccountIndex: React.FC<BankAccountIndexPageProps> = ({ bank_accounts }) => {
  const breadcrumbs = useMemo(
    () => [{ title: 'Einstellungen' }, { title: 'Buchhaltung' }, { title: 'Bankkonten' }],
    []
  )

  const handleDocumentTypeAdd = () => {
    router.get(route('app.bookkeeping.bank-account.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neues Bankkonto"
          onClick={handleDocumentTypeAdd}
        />
      </Toolbar>
    ),
    []
  )

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={bank_accounts} />
  }, [bank_accounts])

  return (
    <PageContainer
      title="Bankkonten"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        data={bank_accounts.data}
        footer={footer}
        itemName="Bankkonten"
      />
    </PageContainer>
  )
}

export default BankAccountIndex
