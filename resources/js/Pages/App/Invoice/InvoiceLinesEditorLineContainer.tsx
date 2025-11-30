import { DragDropVerticalIcon, MoreVerticalCircle01Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { Icon } from '@/Components/ui/twc-ui/icon'

interface InvoiceLinesEditorLineContainerProps {
  invoiceLine: App.Data.InvoiceLineData
  children: React.ReactNode
}

export const InvoiceLinesEditorLineContainer: React.FC<InvoiceLinesEditorLineContainerProps> = ({
  children,
  invoiceLine
}) => {
  return (
    <div className="flex">
      <div className="py-8 pl-4">
        <Icon icon={DragDropVerticalIcon} className="size-4" strokeWidth={4} />
      </div>
      <div className="flex flex-1">{children}</div>
      <div className="py-6 pr-2.5">
        <Button variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon} />
      </div>
    </div>
  )
}
