/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useCallback } from 'react'

interface FileDownloadProps {
  route: string
  filename?: string
}

export const useFileDownload = ({ route, filename }: FileDownloadProps) => {
  const handleDownload = useCallback(() => {
    fetch(route as unknown as string)
      .then(async res => {
        // Dateinamen aus dem Content-Disposition Header extrahieren
        const contentDisposition = res.headers.get('Content-Disposition')
        let serverFilename = filename

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (filenameMatch?.[1]) {
            serverFilename = filenameMatch[1].replace(/['"]/g, '')
          }
        }

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
  }, [filename, route])

  return { handleDownload }
}
