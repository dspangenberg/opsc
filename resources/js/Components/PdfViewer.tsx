/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type { PDFDocumentProxy } from 'pdfjs-dist'
import print from 'print-js'
import type React from 'react'
import { useRef, useState } from 'react'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

import { useFullscreen, useToggle } from 'react-use'
import { PdfViewerContainer } from '@/Components/PdfViewerContainer'
import { useFileDownload } from '@/Hooks/useFileDownload'

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
