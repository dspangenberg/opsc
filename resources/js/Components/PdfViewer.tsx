/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type React from 'react'
import { Dialog, DialogBody } from '@/Components/ui/twc-ui/dialog'
import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

import { PdfContainer } from '@/Components/ui/twc-ui/pdf-container'

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

  return (
    <Dialog isOpen={open} onOpenChange={handleOpenChange} title={filename} width="3xl">
      <DialogBody>
        <PdfContainer file={document} filename={filename} hideFilename />
      </DialogBody>
    </Dialog>
  )
}
