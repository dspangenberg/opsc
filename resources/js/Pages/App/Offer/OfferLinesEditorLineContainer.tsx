import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Copy01Icon,
  Delete03Icon,
  DragDropVerticalIcon,
  MoreVerticalCircle01Icon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { MenuItem } from '@/Components/twc-ui/menu'
import { useOfferTable } from './OfferTableProvider'

interface OfferLinesEditorLineContainerProps {
  offerLine: App.Data.OfferLineData
  children: React.ReactNode
}

export const OfferLinesEditorLineContainer: React.FC<OfferLinesEditorLineContainerProps> = ({
  children,
  offerLine
}) => {
  const { duplicateLine, removeLine, updateLine } = useOfferTable()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: offerLine.id ?? 0
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const changeLineType = (id: number, type_id: number) => {
    updateLine(id, { type_id })
  }

  return (
    <div ref={setNodeRef} style={style} className="flex">
      <div className="cursor-grab py-8 pl-4 active:cursor-grabbing" {...attributes} {...listeners}>
        <Icon icon={DragDropVerticalIcon} className="size-4" strokeWidth={4} />
      </div>
      <div className="flex flex-1">{children}</div>
      <div className="py-6 pr-2.5">
        <DropdownButton variant="ghost" size="icon-sm" icon={MoreVerticalCircle01Icon}>
          {offerLine.type_id === 1 && (
            <MenuItem
              title="In Überschreibaren Gesamtpreis umwandeln"
              separator
              onClick={() => changeLineType(offerLine.id as number, 3)}
            />
          )}
          {offerLine.type_id === 3 && (
            <MenuItem
              title="In Standard-Rechnungsposition umwandeln"
              separator
              onClick={() => changeLineType(offerLine.id as number, 1)}
            />
          )}
          <MenuItem
            icon={Copy01Icon}
            title="Duplizieren"
            separator
            onClick={() => duplicateLine(offerLine)}
          />
          <MenuItem
            icon={Delete03Icon}
            variant="destructive"
            title="Löschen"
            onClick={() => removeLine(offerLine.id)}
          />
        </DropdownButton>
      </div>
    </div>
  )
}
