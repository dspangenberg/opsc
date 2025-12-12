import {
  Copy01Icon,
  Delete03Icon,
  DragDropVerticalIcon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Icon } from '@/Components/ui/twc-ui/icon'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'

interface InvoiceLinesEditorLineContainerProps {
  invoiceLine: App.Data.InvoiceLineData
  children: React.ReactNode
}

export const InvoiceLinesEditorLineContainer: React.FC<InvoiceLinesEditorLineContainerProps> = ({
  children,
  invoiceLine
}) => {
  const { duplicateLine, removeLine } = useInvoiceTable()

  return (
    <div className="flex">
      <div className="py-8 pl-4">
        <Icon icon={DragDropVerticalIcon} className="size-4" strokeWidth={4} />
      </div>
      <div className="flex flex-1">{children}</div>
      <div className="py-6 pr-2.5">
        <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
          <MenuItem
            icon={Copy01Icon}
            title="Duplizieren"
            separator
            onClick={() => duplicateLine(invoiceLine)}
          />
          <MenuItem
            icon={Delete03Icon}
            variant="destructive"
            title="Löschen"
            onClick={() => removeLine(invoiceLine.id)}
          />
        </DropdownButton>
      </div>
    </div>
  )
}
