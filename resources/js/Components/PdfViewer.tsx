/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { useMemo, useRef, useState } from 'react'
import { Dialog } from '@/Components/twcui/dialog'
import { Separator } from '@/Components/ui/separator'
import print from 'print-js'
import { Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjs from 'pdfjs-dist'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { LogoSpinner } from '@dspangenberg/twcui'

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FileDownloadIcon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon,
  SquareArrowDiagonal02Icon,
  MoreVerticalIcon, MoreVerticalCircle01Icon, Add01Icon
} from '@hugeicons/core-free-icons'
import { useFileDownload } from '@/Hooks/useFileDownload'
import {useFullscreen, useToggle} from 'react-use'

import { cn } from '@/Lib/utils'
import { ChevronDown } from 'lucide-react'
import { Toolbar } from '@/Components/twcui/toolbar'
import { Button } from '@/Components/twcui/button'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

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

  const divRef = useRef<HTMLDivElement>(null);
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(divRef, show, {onClose: () => toggle(false)});


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
        <DropdownButton variant="toolbar" icon={MoreVerticalCircle01Icon} placement="bottom start">
          <MenuItem icon={Add01Icon} title="Rechnung hinzufügen" ellipsis separator />
          <MenuItem icon={PrinterIcon} title="Auswertung drucken" ellipsis />
        </DropdownButton>
        <Button variant="toolbar" icon={ArrowDown01Icon} title="Seite vor" disabled={numPages === 1}  />
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={SearchMinusIcon} title="Verkleinern" onClick={handleScaleOut}/>
        <Button variant="toolbar" icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn}/>
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={PrinterIcon} title="Drucken" onClick={handlePrint}/>
        <Button variant="toolbar" icon={FileDownloadIcon} title="Download" onClick={handleDownload}/>
        <Separator orientation="vertical" />
        <Button variant="toolbar" icon={SquareArrowDiagonal02Icon} title="Vollbildmodus" onClick={toggle}/>
      </Toolbar>
    ),
    [numPages, handleDownload, scale]
  )

  const fullscreenControls = useMemo(
    () => (
      <div className="border rounded-lg shadow-md m-6 py-2 px-4">
        {toolbar}
      </div>
    ),
    [isFullscreen]
  )

  return (
    <Dialog
      isOpen={open}
      onOpenChange={handleOpenChange}
      title={filename}
      toolbar={toolbar}
    >


        <div ref={divRef}  className="flex flex-col items-center bg-white justify-center aspect-[210/297] w-3xl overflow-auto rounded-b-lg">
          {isFullscreen && (<div>{fullscreenControls}</div>)}
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
            className="bg-white mx-auto my-auto overflow-auto "
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}

              className="z-10 border flex-1"
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
