import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Pagination } from '@/Components/Pagination'
import { SettingEditDialog } from '@/Pages/Admin/Setting/SettingEdit'
import type { PageProps } from '@/Types'
import { createColumns } from './SettingIndexColumns'

interface SettingIndexPageProps extends PageProps {
  settings: App.Data.Paginated.PaginationMeta<App.Data.SettingData[]>
}

const SettingIndex: React.FC<SettingIndexPageProps> = ({ settings }) => {
  const handleEditSetting = async (row: App.Data.SettingData) => {
    const value = await SettingEditDialog.call({ setting: row })
    if (value !== false) {
      row.value = value
      router.put(route('admin.setting.update'), {
        group: row.group,
        key: row.key,
        value: value
      })
    }
  }

  const footer = useMemo(() => {
    // Nur Pagination rendern, wenn cost_centers existiert
    return <Pagination data={settings} />
  }, [settings])

  const columns = useMemo(
    () =>
      createColumns({
        onEditSetting: handleEditSetting
      }),
    []
  )

  return (
    <PageContainer title="Einstellungen" width="7xl" className="flex overflow-hidden">
      <DataTable footer={footer} data={settings.data} columns={columns} itemName="Benutzerkonten" />
    </PageContainer>
  )
}

export default SettingIndex
