import { useForm } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo, useState } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { useFileUpload } from '@/Hooks/use-file-upload'
import type { PageProps } from '@/Types'

interface DocumentUploadPageProps extends PageProps {}

const DocumentUpload: React.FC<DocumentUploadPageProps> = () => {
  const breadcrumbs = useMemo(
    () => [{ title: 'Dokumente', url: route('app.document.index') }, { title: 'Upload' }],
    []
  )

  return (
    <PageContainer
      title="Upload"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex flex-col overflow-hidden"
    >
      <div>
        <Upload />
      </div>
    </PageContainer>
  )
}

export default DocumentUpload

export const Upload = () => {
  const { data, setData, post, processing, errors } = useForm({
    files: [] as File[]
  })

  const [fileState, fileActions] = useFileUpload({
    multiple: true, // Mehrere Dateien erlauben
    maxFiles: 20, // Maximal 10 Dateien
    maxSize: 50 * 1024 * 1024, // 50MB pro Datei
    accept: '.pdf,.txt,.zip', // Nur PDF und TXT
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

    post(route('app.document.upload'), {
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
