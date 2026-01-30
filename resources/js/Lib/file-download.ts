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
