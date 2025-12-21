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
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Menu, MenuItem, MenuPopover, MenuSubTrigger } from '@/Components/twc-ui/menu'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import { Badge } from '@/Components/ui/badge'
import type { PageProps } from '@/Types'
import { columns } from './CostCenterIndexColumns'

interface CostCenterIndexPageProps extends PageProps {
  cost_centers: App.Data.Paginated.PaginationMeta<App.Data.CostCenterData[]>
}

const CostCenterIndex: React.FC<CostCenterIndexPageProps> = ({ cost_centers }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.CostCenterData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }, { title: 'Kostenstellen' }], [])

  const handleCostCenterAddClicked = () => {
    router.get(route('app.bookkeeping.cost-centers.create'))
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neue Rechnung"
          onClick={handleCostCenterAddClicked}
        />
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon}>
          <MenuSubTrigger>
            <MenuItem title="Daten importieren" />
            <MenuPopover>
              <Menu>
                <MenuItem
                  icon={FileScriptIcon}
                  title="MoneyMoney JSON-Datei importieren"
                  ellipsis
                  separator
                />
                <MenuItem icon={Csv02Icon} title="CSV-Datei importieren" ellipsis />
              </Menu>
            </MenuPopover>
          </MenuSubTrigger>
          <MenuItem icon={FileExportIcon} title="CSV-Export" separator />
          <MenuItem title="Regeln auf unbestägite Transaktionen anwenden" ellipsis />
        </DropdownButton>
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
    return <Pagination data={cost_centers} />
  }, [cost_centers])

  return (
    <PageContainer
      title="Kostenstellen"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={cost_centers.data}
        footer={footer}
        itemName="Kostenstellen"
      />
    </PageContainer>
  )
}

export default CostCenterIndex
