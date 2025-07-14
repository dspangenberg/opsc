/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { useMemo, useRef, useState } from 'react'
import { Dialog } from '@/Components/twcui/dialog'
import { Separator } from '@/Components/twcui/separator'
import print from 'print-js'
import { Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'react-pdf'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { LogoSpinner } from '@dspangenberg/twcui'

// Import the worker setup
import '@/utils/pdf-worker'

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FileDownloadIcon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon,
  SquareArrowDiagonal02Icon
} from '@hugeicons/core-free-icons'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { useFullscreen, useToggle } from 'react-use'

import { cn } from '@/Lib/utils'
import { Toolbar } from '@/Components/twcui/toolbar'
import { Button } from '@/Components/twcui/button'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'


interface Props {
  document: string
  open: boolean
  filename?: string
  onOpenChange: (isOpen: boolean) => void
}

export const PdfViewer: React.FC<Props> = ({
  document,
  open,
  onOpenChange,
  filename = 'unbekannt.pdf'
}) => {
  const handleOpenChange = (newIsOpen: boolean) => {
    onOpenChange(newIsOpen)
  }

  const divRef = useRef<HTMLDivElement>(null)
  const [show, toggle] = useToggle(false)
  const isFullscreen = useFullscreen(divRef as React.RefObject<Element>, show, { onClose: () => toggle(false) })

  // const [savedScale, setSaveScale] = useLocalStorage('pdf-scale', 1.3) || 1.3
  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.3)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy): void => {
    setNumPages(pdf.numPages)
    pdfRef.current = pdf
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
        <Button variant="toolbar" icon={ArrowUp01Icon} title="Seite zurück" disabled={pageNumber === 1} />
        <Button variant="toolbar" icon={ArrowDown01Icon} title="Seite vor" disabled={numPages === 1} />
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={SearchMinusIcon} title="Verkleinern" onClick={handleScaleOut} />
        {!isFullscreen && <DropdownButton
          variant="outline"
          size="auto"
          placement="bottom start"
          title={`${Math.round(scale * 100)} %`}
          className="z-[100] isolate"
          onSelectionChange={() => setScale}
          selectedKeys={`scale-${Math.round(scale * 100)}`}
        >
          <MenuItem id="scale-100" title="Originalgröße" separator />
          <MenuItem id="scale-120" title="120 %" onAction={() => setScale(1.2)} />
          <MenuItem id="scale-130" title="130 %" onAction={() => setScale(1.3)} />
          <MenuItem icon={PrinterIcon} title="Auswertung drucken" ellipsis />
        </DropdownButton>
        }
        <Button variant="toolbar" icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn} />
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" onClick={handlePrint} />
        <Button variant="toolbar" icon={FileDownloadIcon} title="Download" onClick={handleDownload} />
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={SquareArrowDiagonal02Icon} title="Vollbildmodus" onClick={toggle} />
      </Toolbar>
    ),
    [numPages, handleDownload, scale, isFullscreen]
  )

  return (
    <Dialog
      isOpen={open}
      onOpenChange={handleOpenChange}
      title={filename}
    >


      <div ref={divRef}
           className="flex aspect-[210/297] max-h-[90%] w-3xl flex-col items-center justify-center overflow-auto bg-white"
      >
        <div className={cn(' py-1', isFullscreen ? 'self-center' : 'w-full self-start px-4 bg-page-content')}>
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

            className="z-10 flex-1 border"
            loading={
              <div className="mx-auto my-auto flex-1">
                <LogoSpinner />
              </div>
            }
          />
        </Document>

      </div>
    </Dialog>
  )
}
