/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Separator } from '@/Components/ui/separator'
import print from 'print-js'
import { Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import * as pdfjs from 'pdfjs-dist'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import { Button, LogoSpinner, Toolbar, ToolbarButton, YkToolbarButton } from '@dspangenberg/twcui'

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  FileDownloadIcon,
  MultiplicationSignIcon,
  PrinterIcon,
  SearchAddIcon,
  SearchMinusIcon,
  SquareArrowDiagonal02Icon,
  MoreVerticalIcon
} from '@hugeicons/core-free-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/Components/ui/dropdown-menu'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { useFullscreen, useLocalStorage } from '@reactuses/core'
import { cn } from '@/Lib/utils'
import { ChevronDown } from 'lucide-react'

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
  const handleOpenChange = (newIsOpen: boolean) => () => {
    onOpenChange(newIsOpen)
  }

  const ref = useRef(null)
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref)

  const [savedScale, setSaveScale] = useLocalStorage('pdf-scale', 1.3) || 1.3
  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(savedScale || 1.3)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy): void => {
    setNumPages(pdf.numPages)
    pdfRef.current = pdf
    setScale(savedScale || 1.3)
    setIsLoading(false)
  }

  const handleScaleIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3))
  }

  const handleSaveScale = () => {
    setSaveScale(scale)
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
      <Toolbar className="shadow-none border-0 space-x-0 justify-start m-0 px-0">
        <ToolbarButton icon={ArrowUp01Icon} title="Seite zurück" />
        <ToolbarButton icon={ArrowDown01Icon} title="Seite vor" disabled={numPages === 1} />
        <Separator orientation="vertical" />
        <ToolbarButton icon={SearchMinusIcon} title="Verkleinern" onClick={handleScaleOut} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <YkToolbarButton asChild>
              <Button variant="outline" tooltip="" className="w-24" size="default">
                {`${Math.round(scale * 100)}%`}
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </YkToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={scale.toString()}
              onValueChange={value => handleSetScale(Number.parseFloat(value))}
            >
              <DropdownMenuRadioItem value="0.5">
                <span className="text-right">50%</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="text-right" value="1">
                <span className="text-right">100%</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="text-right" value="1.5">
                150%
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="text-right" value="2">
                200%
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="text-right" value="2.5">
                250%
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem className="text-right" value="3">
                300%
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveScale}>
                {`${Math.round(scale * 100)}%`} als Standard speichern
              </DropdownMenuItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ToolbarButton icon={SearchAddIcon} title="Vergrößern" onClick={handleScaleIn} />
        <Separator orientation="vertical" />
        <ToolbarButton icon={PrinterIcon} title="Drucken" onClick={handlePrint} />
        <ToolbarButton icon={FileDownloadIcon} title="Download" onClick={handleDownload} />
        <Separator orientation="vertical" />
        <ToolbarButton
          icon={SquareArrowDiagonal02Icon}
          title="Vollbildmodus"
          onClick={toggleFullscreen}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <YkToolbarButton asChild>
              <Button variant="ghost" size="icon" icon={MoreVerticalIcon} className="text-primary"/>
            </YkToolbarButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            Hi
          </DropdownMenuContent>
        </DropdownMenu>
      </Toolbar>
    ),
    [numPages, handleDownload, toggleFullscreen, scale]
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={ref}
        className={cn(
          'gap-0  bg-white rounded-b-lg',
          isFullscreen ? 'h-screen w-screen' : 'w-screen !max-w-3xl'
        )}
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
                    className="text-foreground/50 cursor-default -mr-1"
                  />
                </div>
              </div>
              <div className="flex-1 flex items-center w-full">
                <div className="flex-1 items-start justify-start">{toolbar}</div>
              </div>
            </div>
          </DialogTitle>
          <VisuallyHidden>
            <DialogDescription>Beleg verschieben</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className="flex items-center bg-white justify-center aspect-[210/297] w-3xl overflow-auto rounded-b-lg">
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
      </DialogContent>
    </Dialog>
  )
}
