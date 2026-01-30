import { useCallback } from 'react'
import type { MouseEvent } from 'react'

export const extractFilenameFromContentDisposition = (
  contentDisposition?: string | null
): string | undefined => {
  if (!contentDisposition) return undefined

  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)

  return filenameMatch?.[1]?.replace(/['"]/g, '')
}

export const extractFilenameFromUrl = (url: string, fallback = 'unbekannt.pdf'): string => {
  try {
    const parsedUrl = new URL(url, window.location.origin)
    const pathname = parsedUrl.pathname
    const parts = pathname.split('/')
    const lastPart = parts[parts.length - 1]
    return lastPart || fallback
  } catch {
    return fallback
  }
}

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
        const serverFilename = extractFilenameFromContentDisposition(contentDisposition)
          ?? resolvedFilename
          ?? extractFilenameFromUrl(resolvedRoute as string)

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
