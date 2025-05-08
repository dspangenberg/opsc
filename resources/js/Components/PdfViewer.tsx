/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/Components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Separator } from '@/Components/ui/separator'
import print from 'print-js'
import { Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjs from 'pdfjs-dist'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Button, Toolbar, ToolbarButton, YkToolbarButton } from '@dspangenberg/twcui'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  FileDownloadIcon,
  SearchFocusIcon,
  MoreVerticalIcon,
  MultiplicationSignIcon,
  SquareArrowDiagonal02Icon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon
} from '@hugeicons/core-free-icons'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu'
import { HugeiconsIcon } from '@hugeicons/react'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { useFullscreen } from '@reactuses/core'
import { cn } from '@/Lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  document: string
  open: boolean
  filename?: string
  onOpenChange: (isOpen: boolean) => void
}
export const PdfViewer: React.FC<Props> = ({ document, open, onOpenChange, filename = 'unbekannt.pdf' }) => {
  const handleOpenChange = (newIsOpen: boolean) => () => {
    onOpenChange(newIsOpen)
  }

  const ref = useRef(null)
  const [isFullscreen, {toggleFullscreen }]
    = useFullscreen(ref);


  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.1)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy): void => {
    setIsLoading(false)
    setNumPages(pdf.numPages)
    pdfRef.current = pdf
  }

  const handleScaleIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3))
  }

  const handleScaleOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5))
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
  });

  const toolbar = useMemo(
    () => (
      <Toolbar className="shadow-none border-0 space-x-0 justify-start m-0 px-0">
        <ToolbarButton icon={ArrowUp01Icon} title="Seite zurück" />
        <ToolbarButton icon={ArrowDown01Icon} title="Seite vor" disabled={numPages === 1} />
        <Separator orientation="vertical" />
        <ToolbarButton
          icon={SearchMinusIcon}
          title="Verkleinern"
          onClick={handleScaleOut}
        />

        <ToolbarButton icon={SearchFocusIcon} title="Originalgröße" onClick={handleScaleReset} />
        <ToolbarButton icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn} />

        <Separator orientation="vertical" />
        <ToolbarButton icon={PrinterIcon} title="Drucken" onClick={handlePrint} />
        <ToolbarButton icon={FileDownloadIcon} title="Download"  onClick={handleDownload}/>
        <Separator orientation="vertical" />
        <ToolbarButton icon={SquareArrowDiagonal02Icon} title="Vollbildmodus" onClick={toggleFullscreen}/>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <YkToolbarButton asChild>
              <Button
                variant="ghost"
                tooltip=""
                size="icon"
                icon={MoreVerticalIcon}
                className="text-primary"
              />
            </YkToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handlePrint}>
              <HugeiconsIcon icon={PrinterIcon} />
              PDF drucken &hellip;
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Toolbar>
    ),
    []
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={ref}
        className={cn('gap-0  bg-white rounded-b-lg', isFullscreen ? 'h-screen w-screen' : 'w-screen !max-w-3xl')}
        onEscapeKeyDown={handleOpenChange(false)}
        onInteractOutside={handleOpenChange(false)}
      >
        <DialogHeader className="bg-sidebar px-2 py-0.5 my-0">
          <DialogTitle className="px-0">
            <div className="flex items-center justify-start overflow-hidden flex-col">
              <div className="flex-none flex w-full ">
                <div className="flex-1 flex items-center justify-center w-full text-base text-center">
                  {filename}
                </div>
                <div className="flex-none flex justify-center">
                  <Button
                    icon={MultiplicationSignIcon}
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleOpenChange(false)}
                    className="text-foreground/50"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center w-full">
                <div className="flex-1 items-start justify-start">
                  {toolbar}
                </div>
              </div>
            </div>
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Beleg verschieben</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div  className="flex items-center bg-white justify-center aspect-[210/297] w-3xl overflow-auto rounded-b-lg">
          <Document
            file={document}
            loading=""
            className="bg-white mx-auto my-auto overflow-auto "
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} scale={scale} className="z-10 border flex-1" loading="" />
          </Document>
        </div>

      </DialogContent>
    </Dialog>
  )
}
