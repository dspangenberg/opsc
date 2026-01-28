import { useCallback } from 'react'
import type { MouseEvent } from 'react'
import { extractFilenameFromContentDisposition } from '@/Lib/file-download'

interface FileDownloadProps {
  route?: string
  filename?: string
}

type HandleDownload = (route?: string | MouseEvent, filename?: string) => void

export const useFileDownload = (options?: FileDownloadProps): { handleDownload: HandleDownload } => {
  const { route: defaultRoute, filename: defaultFilename } = options ?? {}
  const handleDownload = useCallback<HandleDownload>((route, filename) => {
    const resolvedRoute = typeof route === 'string' ? route : defaultRoute
    const resolvedFilename = filename ?? defaultFilename

    if (!resolvedRoute) {
      console.error('Error downloading file: missing route')
      return
    }

    fetch(resolvedRoute as unknown as string)
      .then(async res => {
        // Dateinamen aus dem Content-Disposition Header extrahieren
        const contentDisposition = res.headers.get('Content-Disposition')
        const serverFilename = extractFilenameFromContentDisposition(contentDisposition) ?? resolvedFilename

        const blob = await res.blob()
        return {
          blob,
          filename: serverFilename
        }
      })
      .then(({ blob, filename: downloadFilename }) => {
        const file = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = file
        link.download = downloadFilename || 'unknown.pdf'

        link.click()
        window.URL.revokeObjectURL(file)
      })
      .catch(error => {
        console.error('Error downloading file:', error)
        // You might want to add some error handling here, like showing a notification to the user
      })
  }, [defaultFilename, defaultRoute])

  return { handleDownload }
}
