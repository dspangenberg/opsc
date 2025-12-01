/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { PDFDocumentProxy } from 'pdfjs-dist'
import print from 'print-js'
import type React from 'react'
import { useMemo, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'
import { Separator } from '@/Components/twcui/separator'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { LogoSpinner } from '@/Components/ui/logo-spinner'

// Import the worker setup

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FileDownloadIcon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon,
  SquareArrowDiagonal02Icon
} from '@hugeicons/core-free-icons'
import { pdfjs } from 'react-pdf'
import { useFullscreen, useToggle } from 'react-use'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { cn } from '@/Lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  document: string
  filename?: string
  showFileName?: boolean
}

export const PdfViewerContainer: React.FC<Props> = ({
  document,
  filename = 'unbekannt.pdf',
  showFileName = false
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [show, toggle] = useToggle(false)
  const isFullscreen = useFullscreen(divRef as React.RefObject<Element>, show, {
    onClose: () => toggle(false)
  })

  // const [savedScale, setSaveScale] = useLocalStorage('pdf-scale', 1.3) || 1.3
  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number>(1)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.3)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const onDocumentLoadSuccess = (document: any): void => {
    setNumPages(document.numPages)
    pdfRef.current = document
    setScale(1.3)
    setIsLoading(false)
  }

  const handleScaleIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3))
  }

  const handleSaveScale = () => {
    // setSaveScale(scale)
  }

  const handleScaleOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5))
  }

  const handleSetScale = (value: number) => {
    setScale(prevScale => value)
  }

  const handleScaleReset = () => {
    setScale(1)
  }

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    }
  }

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(prevPageNumber => prevPageNumber - 1)
    }
  }

  const handlePrint = () => {
    print(document)
  }

  const { handleDownload } = useFileDownload({
    route: document,
    filename: filename
  })

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
        {!isFullscreen && (
          <DropdownButton
            variant="outline"
            size="auto"
            placement="bottom start"
            title={`${Math.round(scale * 100)} %`}
            className="isolate z-[100]"
            onSelectionChange={() => setScale}
            selectedKeys={`scale-${Math.round(scale * 100)}`}
          >
            <MenuItem id="scale-100" title="Originalgröße" separator onAction={() => setScale(1)} />
            <MenuItem id="scale-120" title="120 %" onAction={() => setScale(1.2)} />
            <MenuItem id="scale-130" title="130 %" onAction={() => setScale(1.3)} />
          </DropdownButton>
        )}
        <Button variant="toolbar" icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn} />
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
    [numPages, handleDownload, scale, isFullscreen, pageNumber, toggle]
  )

  return (
    <div
      ref={divRef}
      className="flex aspect-[210/297] max-h-[90%] w-3xl flex-col items-center justify-center overflow-auto rounded-md border bg-white"
    >
      <div
        className={cn(
          'py-1',
          isFullscreen ? 'self-center' : 'w-full self-start bg-page-content px-4'
        )}
      >
        {showFileName && (
          <div className="my-2 text-center font-medium text-base">
            {filename} &mdash; Seite {pageNumber}/{numPages}
          </div>
        )}
        {toolbar}
      </div>

      {isLoading && (
        <div className="mx-auto my-auto flex-1">
          <LogoSpinner />
        </div>
      )}
      <Document
        file={document}
        loading={
          <div className="mx-auto my-auto flex-1">
            <LogoSpinner />
          </div>
        }
        className="mx-auto my-auto overflow-auto bg-white"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          className="z-10 mx-auto flex-1 border"
          loading={
            <div className="mx-auto my-auto flex-1">
              <LogoSpinner />
            </div>
          }
        />
      </Document>
    </div>
  )
}
