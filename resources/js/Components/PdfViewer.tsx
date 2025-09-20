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
import { LogoSpinner } from '@dspangenberg/twcui'

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
import { PdfViewerContainer } from '@/Components/PdfViewerContainer'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Button } from '@/Components/ui/twc-ui/button'
import { Toolbar } from '@/Components/ui/twc-ui/toolbar'
import { useFileDownload } from '@/Hooks/useFileDownload'
import { cn } from '@/Lib/utils'

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
  const isFullscreen = useFullscreen(divRef as React.RefObject<Element>, show, {
    onClose: () => toggle(false)
  })

  // const [savedScale, setSaveScale] = useLocalStorage('pdf-scale', 1.3) || 1.3
  const pdfRef = useRef<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
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

  const handlePrint = () => {
    print(document)
  }

  const { handleDownload } = useFileDownload({
    route: document,
    filename: filename
  })

  return (
    <Dialog isOpen={open} onOpenChange={handleOpenChange} title={filename} width="3xl">
      <PdfViewerContainer document={document} filename={filename} showFileName={false} />
    </Dialog>
  )
}
