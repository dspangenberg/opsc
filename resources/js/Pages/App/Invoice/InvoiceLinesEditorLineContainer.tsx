import {
  Copy01Icon,
  Delete03Icon,
  DragDropVerticalIcon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
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

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: invoiceLine.id ?? 0
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style} className="flex">
      <div className="cursor-grab py-8 pl-4 active:cursor-grabbing" {...attributes} {...listeners}>
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
