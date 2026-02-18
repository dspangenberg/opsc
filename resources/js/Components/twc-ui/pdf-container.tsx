import type { PDFDocumentProxy } from 'pdfjs-dist'
import print from 'print-js'
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { LogoSpinner } from './logo-spinner'
import { Separator } from './separator'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  FileDownloadIcon,
  FourFinger03Icon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon,
  SquareArrowDiagonal02Icon
} from '@hugeicons/core-free-icons'
import { TextCursor } from 'lucide-react'
import { Icon } from '@/Components/twc-ui/icon'
import {
  extractFilenameFromContentDisposition,
  extractFilenameFromUrl,
  useFileDownload
} from '@/Hooks/use-file-download'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { DropdownButton } from './dropdown-button'
import { MenuItem } from './menu'
import { ToggleButtonGroup, ToggleButtonGroupItem } from './toggle-button-group'
import { Toolbar } from './toolbar'

// Native implementation of useToggle
const useToggle = (initialValue = false): [boolean, (value?: boolean) => void] => {
  const [value, setValue] = useState(initialValue)
  const toggle = useCallback((newValue?: boolean) => {
    setValue(prev => (newValue !== undefined ? newValue : !prev))
  }, [])
  return [value, toggle]
}

// Native implementation of useFullscreen
const useFullscreen = (
  ref: React.RefObject<Element>,
  enabled: boolean,
  options?: { onClose?: () => void }
) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const onClose = options?.onClose

  useEffect(() => {
    if (!ref.current) return

    const onFullscreenChange = () => {
      const isFull = !!document.fullscreenElement
      setIsFullscreen(isFull)
      if (!isFull && onClose) {
        onClose()
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [onClose])

  useEffect(() => {
    if (!ref.current) return

    if (enabled && !document.fullscreenElement) {
      ref.current.requestFullscreen?.()
    } else if (!enabled && document.fullscreenElement) {
      document.exitFullscreen?.()
    }
  }, [enabled, ref])

  return isFullscreen
}

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  file: string
  filename?: string
  hideFilename?: boolean
  className?: string
  onFilenameChange?: (filename: string) => void
}

export const PdfContainer: React.FC<Props> = ({
  file,
  filename,
  className,
  hideFilename = false,
  onFilenameChange
}) => {
  const baseFilename = useMemo(() => {
    if (filename) return filename
    return extractFilenameFromUrl(file)
  }, [file])

  const divRef = useRef<HTMLDivElement>(null)
  const [show, toggle] = useToggle(false)
  const isFullscreen = useFullscreen(divRef as React.RefObject<Element>, show, {
    onClose: () => toggle(false)
  })

  const [resolvedFilename, setResolvedFilename] = useState(baseFilename)

  useEffect(() => {
    setResolvedFilename(baseFilename)
  }, [baseFilename])

  useEffect(() => {
    if (filename) return
    if (file.startsWith('blob:') || file.startsWith('data:')) return

    let isMounted = true

    const fetchFilename = async () => {
      try {
        const response = await fetch(file, { method: 'HEAD' })
        const contentDisposition = response.headers.get('Content-Disposition')
        const headerFilename = extractFilenameFromContentDisposition(contentDisposition)
        if (headerFilename && isMounted) {
          setResolvedFilename(headerFilename)
        }
      } catch {
        // Ignore filename lookup failures.
      }
    }

    void fetchFilename()

    return () => {
      isMounted = false
    }
  }, [file, filename])

  useEffect(() => {
    onFilenameChange?.(resolvedFilename)
  }, [resolvedFilename, onFilenameChange])

  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.25)
  const [scaleMode, setScaleMode] = useState<string>('scale-125')
  const [showFitToPage, setShowFitToPage] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [cursorTool, setCursorTool] = useState<'select' | 'grab'>('select')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  })
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const checkFitToPageVisibility = async () => {
    if (!pdfRef.current || !scrollContainerRef.current) return
    try {
      const page = await pdfRef.current.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 1 })
      const containerWidth = scrollContainerRef.current.clientWidth
      const containerHeight = scrollContainerRef.current.clientHeight
      const scaleX = (containerWidth - 40) / viewport.width
      const scaleY = (containerHeight - 40) / viewport.height
      const diff = Math.abs(scaleX - scaleY)
      setShowFitToPage(diff > 0.1)
    } catch {
      setShowFitToPage(true)
    }
  }

  const onDocumentLoadSuccess = (document: PDFDocumentProxy): void => {
    setNumPages(document.numPages)
    pdfRef.current = document
    setScale(1.25)
    setIsLoading(false)
    setLoadError(null)
    void checkFitToPageVisibility()
  }

  const onDocumentLoadError = (error: Error): void => {
    setIsLoading(false)
    console.error('PDF load error:', error)

    // Detect common error types
    if (error.message.includes('404') || error.message.includes('Not Found')) {
      setLoadError('PDF-Datei nicht gefunden. Möglicherweise fehlt die Datei im S3-Speicher.')
    } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
      setLoadError('Zugriff auf die PDF-Datei verweigert. Bitte prüfe die S3-Berechtigungen.')
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      setLoadError('Netzwerkfehler beim Laden der PDF-Datei.')
    } else {
      setLoadError('Die PDF-Datei konnte nicht geladen werden.')
    }
  }

  const calculateFitToWidth = useCallback(async () => {
    if (!pdfRef.current || !scrollContainerRef.current) return
    const page = await pdfRef.current.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })
    const containerWidth = scrollContainerRef.current.clientWidth
    const scale = (containerWidth - 40) / viewport.width
    setScale(scale)
    setScaleMode('fit-width')
  }, [pageNumber])

  const calculateFitToPage = useCallback(async () => {
    if (!pdfRef.current || !scrollContainerRef.current) return
    const page = await pdfRef.current.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })
    const containerWidth = scrollContainerRef.current.clientWidth
    const containerHeight = scrollContainerRef.current.clientHeight
    const scaleX = (containerWidth - 40) / viewport.width
    const scaleY = (containerHeight - 40) / viewport.height
    setScale(Math.min(scaleX, scaleY))
    setScaleMode('fit-page')
  }, [pageNumber])

  const handleScaleIn = useCallback(() => {
    setScale(prevScale => Math.min(prevScale + 0.1, 4))
  }, [])

  const handleScaleOut = useCallback(() => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5))
  }, [])

  const handleNextPage = useCallback(() => {
    if (pageNumber < numPages) {
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    }
  }, [pageNumber, numPages])

  const handlePrevPage = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber(prevPageNumber => prevPageNumber - 1)
    }
  }, [pageNumber])

  const handlePrint = useCallback(() => {
    print(file)
  }, [file])

  const { handleDownload } = useFileDownload({
    route: file,
    filename: resolvedFilename
  })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (cursorTool === 'grab') {
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scrollContainerRef.current) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      scrollContainerRef.current.scrollLeft -= deltaX
      scrollContainerRef.current.scrollTop -= deltaY
      setDragStart({
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar"
          icon={ArrowUp01Icon}
          title="Seite zurück"
          disabled={pageNumber === 1}
          onClick={handlePrevPage}
        />
        <Button
          variant="toolbar"
          icon={ArrowDown01Icon}
          title="Seite vor"
          disabled={pageNumber === numPages}
          onClick={handleNextPage}
        />
        <Separator orientation="vertical" />
        <Button
          variant="toolbar"
          icon={SearchMinusIcon}
          title="Verkleinern"
          onClick={handleScaleOut}
        />
        {!show ? (
          <DropdownButton
            variant="outline"
            size="auto"
            placement="bottom start"
            title={`${Math.round(scale * 100)} %`}
            className="isolate z-9999"
            selectionMode="single"
            selectedKeys={new Set([scaleMode])}
          >
            {showFitToPage && (
              <MenuItem
                id="fit-page"
                title="Ganze Seite"
                className="text-left"
                onAction={calculateFitToPage}
              />
            )}
            <MenuItem
              id="fit-width"
              title="Seitenbreite"
              className="text-left"
              separator
              onAction={calculateFitToWidth}
            />
            <MenuItem
              id="scale-50"
              title="50 %"
              className="text-right"
              onAction={() => {
                setScale(0.5)
                setScaleMode('scale-50')
              }}
            />
            <MenuItem
              id="scale-75"
              title="75 %"
              className="text-right"
              onAction={() => {
                setScale(0.75)
                setScaleMode('scale-75')
              }}
            />
            <MenuItem
              id="scale-100"
              title="100 %"
              className="text-right"
              onAction={() => {
                setScale(1)
                setScaleMode('scale-100')
              }}
            />
            <MenuItem
              id="scale-125"
              title="125 %"
              className="text-right"
              onAction={() => {
                setScale(1.25)
                setScaleMode('scale-125')
              }}
            />
            <MenuItem
              id="scale-150"
              title="150 %"
              className="text-right"
              onAction={() => {
                setScale(1.5)
                setScaleMode('scale-150')
              }}
            />
            <MenuItem
              id="scale-200"
              title="200 %"
              className="text-right"
              onAction={() => {
                setScale(2)
                setScaleMode('scale-200')
              }}
            />
            <MenuItem
              id="scale-300"
              title="300 %"
              className="text-right"
              onAction={() => {
                setScale(3)
                setScaleMode('scale-300')
              }}
            />
            <MenuItem
              id="scale-400"
              title="400 %"
              className="text-right"
              onAction={() => {
                setScale(4)
                setScaleMode('scale-400')
              }}
            />
          </DropdownButton>
        ) : (
          <div className="px-2 pt-2 text-sm">{Math.round(scale * 100)} %</div>
        )}
        <Button variant="toolbar" icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn} />
        <Separator orientation="vertical" />

        <ToggleButtonGroup
          variant="toolbar"
          aria-label="Cursor"
          selectionMode="single"
          selectedKeys={new Set([cursorTool])}
          onSelectionChange={keys => {
            const value = Array.from(keys)[0] as 'select' | 'grab'
            if (value) setCursorTool(value)
          }}
        >
          <ToggleButtonGroupItem id="select" icon={TextCursor} aria-label="Textauswahl" />
          <ToggleButtonGroupItem id="grab" icon={FourFinger03Icon} aria-label="Hand-Werkzeug" />
        </ToggleButtonGroup>
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" onClick={handlePrint} />
        <Button
          variant="toolbar"
          icon={FileDownloadIcon}
          title="Download"
          onClick={handleDownload}
        />
        <Separator orientation="vertical" />
        <Button
          variant="toolbar"
          icon={SquareArrowDiagonal02Icon}
          title="Vollbildmodus"
          onClick={() => toggle()}
        />
      </Toolbar>
    ),
    [
      scale,
      cursorTool,
      show,
      calculateFitToPage,
      calculateFitToWidth,
      handleScaleIn,
      handleScaleOut,
      handleNextPage,
      handlePrevPage,
      handlePrint,
      handleDownload,
      toggle,
      pageNumber,
      numPages
    ]
  )

  return (
    <div
      ref={divRef}
      className={cn(
        className,
        'relative flex aspect-210/297 max-h-[90%] w-3xl flex-col items-center justify-center rounded-md border bg-white'
      )}
    >
      <div
        className={cn(
          'z-10 py-1',
          isFullscreen ? 'self-center' : 'w-full self-start border-b bg-page-content px-4'
        )}
      >
        {!hideFilename && (
          <div className="my-2 text-center font-medium text-base">
            {resolvedFilename} &mdash; Seite {pageNumber}/{numPages}
          </div>
        )}
        {toolbar}
      </div>

      <div className="w-full flex-1 overflow-hidden">
        {isLoading && (
          <div className="mx-auto my-auto flex-1">
            <LogoSpinner />
          </div>
        )}
        <Document
          file={file}
          loading={
            <div className="mx-auto my-auto flex-1">
              <LogoSpinner />
            </div>
          }
          error={
            <div className="flex h-full w-full items-center justify-center p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-4 flex items-center justify-center rounded-full">
                  <Icon
                    icon={AlertCircleIcon}
                    className="size-10 rounded-full bg-destructive/50 text-white"
                  />
                </div>
                <h3 className="mb-2 font-semibold text-lg">Das hat leider nicht funktioniert.</h3>
                <p className="mb-4 text-base text-muted-foreground">
                  {loadError || 'Die PDF-Datei konnte nicht geladen werden.'}
                </p>
                <p className="text-muted-foreground text-sm">
                  Dies kann passieren, wenn die Datenbank von einem anderen System importiert wurde
                  und die Dateien nicht im lokalen S3-Speicher verfügbar sind.
                </p>
              </div>
            </div>
          }
          className="h-full w-full overflow-auto bg-accent"
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          inputRef={scrollContainerRef}
        >
          <div
            style={{
              cursor: cursorTool === 'grab' ? (isDragging ? 'grabbing' : 'grab') : 'text',
              userSelect: cursorTool === 'grab' ? 'none' : 'auto',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 'calc(100% + 4rem)',
              minWidth: 'calc(100% + 4rem)',
              margin: '-2rem'
            }}
            className={cn(
              cursorTool === 'grab' &&
                '[&_.react-pdf__Page__textContent]:pointer-events-none [&_.react-pdf__Page__textContent]:select-none',
              cursorTool === 'grab' && '**:cursor-grab!',
              isDragging && '**:cursor-grabbing!'
            )}
            role="application"
            aria-label="PDF viewer - use mouse to pan when grab tool is selected"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="z-10 border"
              loading={
                <div className="mx-auto my-auto flex-1">
                  <LogoSpinner />
                </div>
              }
            />
          </div>
        </Document>
      </div>
    </div>
  )
}
