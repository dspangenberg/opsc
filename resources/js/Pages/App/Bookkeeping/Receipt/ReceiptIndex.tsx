import {
  Add01Icon,
  Csv02Icon,
  FileExportIcon,
  FileScriptIcon,
  MoreVerticalCircle01Icon,
  Tick01Icon
} from '@hugeicons/core-free-icons'
import { router, useForm } from '@inertiajs/react'
import type * as React from 'react'
import { type FormEvent, useMemo, useState } from 'react'
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
import { useFileUpload } from '@/Hooks/use-file-upload'
import type { PageProps } from '@/Types'
import { columns } from './ReceiptIndexColumns'

interface ReceiptIndexPageProps extends PageProps {
  receipts: App.Data.Paginated.PaginationMeta<App.Data.ReceiptData[]>
}

const ReceiptIndex: React.FC<ReceiptIndexPageProps> = ({ receipts }) => {
  const [selectedRows, setSelectedRows] = useState<App.Data.ReceiptData[]>([])

  const breadcrumbs = useMemo(() => [{ title: 'Buchhaltung' }, { title: 'Belege' }], [])
  const toolbar = useMemo(
    () => (
      <Toolbar>
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
    return <Pagination data={receipts} />
  }, [receipts])

  return (
    <PageContainer
      title="Belege"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
    >
      <ReceiptUpload />
      <DataTable
        columns={columns}
        actionBar={actionBar}
        onSelectedRowsChange={setSelectedRows}
        data={receipts.data}
        footer={footer}
        itemName="Belege"
      />
    </PageContainer>
  )
}

export default ReceiptIndex

export const ReceiptUpload = () => {
  const { data, setData, post, processing, errors } = useForm({
    files: [] as File[]
  })

  const [fileState, fileActions] = useFileUpload({
    multiple: true, // Mehrere Dateien erlauben
    maxFiles: 20, // Maximal 10 Dateien
    maxSize: 50 * 1024 * 1024, // 50MB pro Datei
    accept: '.pdf,.txt', // Nur PDF und TXT
    onFilesChange: files => {
      // Konvertiere FileWithPreview[] zu File[]
      const actualFiles = files.map(f => f.file).filter(f => f instanceof File) as File[]
      setData('files', actualFiles)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (data.files.length === 0) {
      alert('Bitte wählen Sie mindestens eine Datei aus.')
      return
    }

    post(route('app.bookkeeping.receipts.upload'), {
      forceFormData: true,
      onSuccess: () => {
        fileActions.clearFiles()
      },
      onError: errors => {
        console.error('Upload-Fehler:', errors)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Drag & Drop Area - Verwende ein button-Element statt div */}
        <button
          type="button"
          className={`w-full rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            fileState.isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={fileActions.handleDragEnter}
          onDragLeave={fileActions.handleDragLeave}
          onDragOver={fileActions.handleDragOver}
          onDrop={fileActions.handleDrop}
          onClick={fileActions.openFileDialog}
          aria-label="Dateien per Drag & Drop hinzufügen oder durchsuchen"
        >
          <input {...fileActions.getInputProps({ className: 'hidden' })} />

          <p className="text-gray-600">Dateien hier hinziehen oder durchsuchen</p>
          <p className="mt-2 text-gray-400 text-sm">
            PDF und TXT Dateien, max. 50MB pro Datei, max. 10 Dateien
          </p>
        </button>

        {/* File List */}
        {fileState.files.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Ausgewählte Dateien:</h3>
            {fileState.files.map(fileWithPreview => (
              <div
                key={fileWithPreview.id}
                className="flex items-center justify-between rounded bg-gray-50 p-2"
              >
                <span className="text-sm">{fileWithPreview.file.name}</span>
                <button
                  type="button"
                  onClick={() => fileActions.removeFile(fileWithPreview.id)}
                  className="text-red-600 text-sm hover:text-red-800"
                  aria-label={`${fileWithPreview.file.name} entfernen`}
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Errors */}
        {fileState.errors.length > 0 && (
          <div className="rounded border border-red-200 bg-red-50 p-3" role="alert">
            {fileState.errors.map((error, index) => (
              <p key={index} className="text-red-600 text-sm">
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Server Errors */}
        {errors.files && (
          <div className="rounded border border-red-200 bg-red-50 p-3" role="alert">
            <p className="text-red-600 text-sm">{errors.files}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={processing || fileState.files.length === 0}
          isLoading={processing}
        >
          {fileState.files.length === 1
            ? 'Datei hochladen'
            : `${fileState.files.length} Dateien hochladen`}
        </Button>
      </div>
    </form>
  )
}
