import {
  Add01Icon,
  Csv02Icon,
  FileExportIcon,
  FileScriptIcon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import {
  DropdownButton,
  Menu,
  MenuItem,
  MenuPopover,
  MenuSubTrigger
} from '@/Components/twcui/dropdown-button'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { columns } from './BookkeepingRuleIndexColumns'

interface BookkeepingRuleIndexPageProps extends PageProps {
  rules: App.Data.Paginated.PaginationMeta<App.Data.BookkeepingRuleData[]>
}

const BookkeepingRuleIndex: React.FC<BookkeepingRuleIndexPageProps> = ({ rules }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.BookkeepingRuleData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }, { title: 'Kostenstellen' }], [])

  const handleRuleAddClicked = () => {
    router.get(route('app.bookkeeping.rules.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neue Regel erstellen"
          onClick={handleRuleAddClicked}
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
    return <Pagination data={rules} />
  }, [rules])

  return (
    <PageContainer
      title="Regeln"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={rules.data}
        footer={footer}
        itemName="Regeln"
      />
    </PageContainer>
  )
}

export default BookkeepingRuleIndex
