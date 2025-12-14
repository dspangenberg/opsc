import print from 'print-js'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Separator } from './separator'
import { LogoSpinner } from './logo-spinner'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FileDownloadIcon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon,
  SquareArrowDiagonal02Icon,
  FourFinger03Icon
} from '@hugeicons/core-free-icons'
import { TextCursor } from 'lucide-react';

import { useFullscreen, useToggle } from 'react-use'
import { DropdownButton, MenuItem } from './dropdown-button'
import { Button } from './button'
import { Toolbar } from './toolbar'
import { useFileDownload } from '@/Hooks/use-file-download'
import { cn } from '@/Lib/utils'
import {
  ToggleButtonGroup,
  ToggleButtonGroupItem
} from './toggle-button-group'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  file: string
  filename?: string
  hideFilename?: boolean
}

export const PdfContainer: React.FC<Props> = ({
  file,
  filename,
  hideFilename = false
}) => {
  const defaultFilename = useMemo(() => {
    if (filename) return filename
    try {
      const url = new URL(file, window.location.origin)
      const pathname = url.pathname
      const parts = pathname.split('/')
      const lastPart = parts[parts.length - 1]
      return lastPart || 'unbekannt.pdf'
    } catch {
      return 'unbekannt.pdf'
    }
  }, [file, filename])
  const divRef = useRef<HTMLDivElement>(null)
  const [show, toggle] = useToggle(false)
  const isFullscreen = useFullscreen(divRef as React.RefObject<Element>, show, {
    onClose: () => toggle(false)
  })

  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.25)
  const [scaleMode, setScaleMode] = useState<string>('scale-125')
  const [showFitToPage, setShowFitToPage] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
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

  const onDocumentLoadSuccess = async (document: PDFDocumentProxy): Promise<void> => {
    setNumPages(document.numPages)
    pdfRef.current = document
    setScale(1.25)
    setIsLoading(false)
    await checkFitToPageVisibility()
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
    filename: defaultFilename
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
            {showFitToPage &&
              <MenuItem id="fit-page" title="Ganze Seite" className="text-left" onAction={calculateFitToPage} />}
            <MenuItem id="fit-width" title="Seitenbreite" className="text-left" separator
                      onAction={calculateFitToWidth}
            />
            <MenuItem id="scale-50" title="50 %" className="text-right" onAction={() => {
              setScale(0.5)
              setScaleMode('scale-50')
            }}
            />
            <MenuItem id="scale-75" title="75 %" className="text-right" onAction={() => {
              setScale(0.75)
              setScaleMode('scale-75')
            }}
            />
            <MenuItem id="scale-100" title="100 %" className="text-right" onAction={() => {
              setScale(1)
              setScaleMode('scale-100')
            }}
            />
            <MenuItem id="scale-125" title="125 %" className="text-right" onAction={() => {
              setScale(1.25)
              setScaleMode('scale-125')
            }}
            />
            <MenuItem id="scale-150" title="150 %" className="text-right" onAction={() => {
              setScale(1.5)
              setScaleMode('scale-150')
            }}
            />
            <MenuItem id="scale-200" title="200 %" className="text-right" onAction={() => {
              setScale(2)
              setScaleMode('scale-200')
            }}
            />
            <MenuItem id="scale-300" title="300 %" className="text-right" onAction={() => {
              setScale(3)
              setScaleMode('scale-300')
            }}
            />
            <MenuItem id="scale-400" title="400 %" className="text-right" onAction={() => {
              setScale(4)
              setScaleMode('scale-400')
            }}
            />
          </DropdownButton>
        ) : (
          <div className="px-2 text-sm pt-2">{Math.round(scale * 100)} %</div>
        )}
        <Button variant="toolbar" icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn} />
        <Separator orientation="vertical" />

        <ToggleButtonGroup
          variant="toolbar"
          aria-label="Cursor"
          selectionMode="single"
          selectedKeys={new Set([cursorTool])}
          onSelectionChange={(keys) => {
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
          onClick={toggle}
        />
      </Toolbar>
    ),
    [scale, scaleMode, showFitToPage, cursorTool, show, calculateFitToPage, calculateFitToWidth, handleScaleIn, handleScaleOut, handleNextPage, handlePrevPage, handlePrint, handleDownload, toggle, pageNumber, numPages]
  )

  return (
    <div
      ref={divRef}
      className="flex aspect-210/297 max-h-[90%] w-3xl flex-col items-center justify-center rounded-md border bg-white relative"
    >
      <div
        className={cn(
          'py-1 z-10',
          isFullscreen ? 'self-center' : 'w-full self-start bg-page-content px-4 border-b'
        )}
      >
        {!hideFilename && (
          <div className="my-2 text-center font-medium text-base">
            {defaultFilename} &mdash; Seite {pageNumber}/{numPages}
          </div>
        )}
        {toolbar}
      </div>

      <div className="flex-1 w-full overflow-hidden">
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
          className="overflow-auto h-full w-full bg-stone-50"
          onLoadSuccess={onDocumentLoadSuccess}
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
              cursorTool === 'grab' && '[&_.react-pdf__Page__textContent]:select-none [&_.react-pdf__Page__textContent]:pointer-events-none',
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
