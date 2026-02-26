import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  CalculatorIcon,
  FirstBracketIcon,
  HeadingIcon,
  RowInsertIcon,
  TextAlignJustifyLeftIcon,
  TextVerticalAlignmentIcon
} from '@hugeicons/core-free-icons'
import { type FC, useEffect } from 'react'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { MenuItem } from '@/Components/twc-ui/menu'
import { ScrollCard } from '@/Components/twc-ui/scroll-card'
import { SplitButton } from '@/Components/twc-ui/split-button'
import { InvoiceLinesEditorDefaultLine } from '@/Pages/App/Invoice/InvoiceLinesEditorDefaultLine'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'
import { InvoiceLinesEditorCaptionLine } from './InvoiceLinesEditorCaptionLine'
import { InvoiceLinesEditorPageBreak } from './InvoiceLinesEditorPageBreak'
import { InvoiceLinesEditorTextLine } from './InvoiceLinesEditorTextLine'

interface InvoiceLinesEditorProps {
  invoice: App.Data.InvoiceData
}

type InvoiceLinesFormData = Omit<
  App.Data.InvoiceData,
  | 'parent_invoice'
  | 'contact'
  | 'invoice_contact'
  | 'project'
  | 'offer'
  | 'notables'
  | 'type'
  | 'payment_deadline'
  | 'tax'
  | 'payable'
  | 'booking'
>

export const InvoiceLinesEditor: FC<InvoiceLinesEditorProps> = ({ invoice }) => {
  const { setEditMode, lines, addLine, setLines } = useInvoiceTable()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Helper function to remove circular references from lines
  const sanitizeLines = (linesToSanitize: App.Data.InvoiceLineData[]) => {
    return linesToSanitize.map(line => {
      const { linked_invoice, ...rest } = line
      return rest
    })
  }

  const form = useForm<InvoiceLinesFormData>(
    'app.invoice.lines-update',
    'put',
    route('app.invoice.lines-update', {
      invoice: invoice.id
    }),
    {
      ...invoice,
      lines: sanitizeLines(lines) as any
    }
  )

  // Sync form data when lines change (e.g., when duplicating or adding lines)
  useEffect(() => {
    // Merge current form values with new lines structure to preserve user input
    const currentFormLines = form.data.lines || []
    const mergedLines = lines.map((line, index) => {
      const existingFormLine = currentFormLines.find((fl: any) => fl.id === line.id)
      // If line exists in form with user input, keep form values; otherwise use context values
      return existingFormLine || line
    })
    form.setData('lines', sanitizeLines(mergedLines) as never)
  }, [lines])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = lines.findIndex(line => line.id === active.id)
      const newIndex = lines.findIndex(line => line.id === over.id)

      // Use current form data to preserve user input during drag
      const currentFormLines = form.data.lines || []
      const newLines = [...currentFormLines]
      const [movedItem] = newLines.splice(oldIndex, 1)
      newLines.splice(newIndex, 0, movedItem)

      // Update pos values to reflect new order
      const updatedLines = newLines.map((line, index) => ({
        ...line,
        pos: line.type_id === 9 ? 999 : index
      }))

      // Update both the context state and form data
      setLines(updatedLines as any)
      form.setData('lines', updatedLines as any)
    }
  }

  const onCancel = async () => {
    if (form.isDirty) {
      const promise = await AlertDialog.call({
        title: 'Änderungen verwerfen',
        message: 'Möchtest Du die Änderungen wirklich verwerfen?',
        buttonTitle: 'Verwerfen',
        variant: 'default'
      })

      if (promise) {
        setEditMode(false)
      }
    } else {
      setEditMode(false)
    }
  }

  const onSubmit = () => {
    form.submit({
      preserveScroll: true,
      onSuccess: () => {
        setEditMode(false)
      },
      onError: () => {
        setEditMode(true)
      }
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <ScrollCard className="flex flex-1 overflow-y-hidden" innerClassName="bg-white">
        <div className="grid grid-cols-24 gap-x-3 border-b bg-sidebar px-13 py-2.5 font-medium text-sm">
          <div className="col-span-3">Menge</div>
          <div className="col-span-2">Einheit</div>
          <div className="col-span-10">Beschreibung</div>
          <div className="col-span-4">Einzelpreis</div>
          <div className="col-span-4">Gesamtpreis</div>
          <div>USt.</div>
        </div>
        <Form form={form} errorVariant="field">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={lines.filter(line => line.id != null).map(line => line.id as number)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y">
                {lines.map((line, index: number) => {
                  switch (line.type_id) {
                    case 9:
                      return null
                    case 2:
                      return (
                        <InvoiceLinesEditorCaptionLine
                          key={line.id}
                          invoice={invoice}
                          index={index}
                          invoiceLine={line}
                        />
                      )
                    case 4:
                      return (
                        <InvoiceLinesEditorTextLine
                          key={line.id}
                          invoice={invoice}
                          index={index}
                          invoiceLine={line}
                        />
                      )
                    case 8:
                      return (
                        <InvoiceLinesEditorPageBreak
                          key={line.id}
                          invoice={invoice}
                          index={index}
                          invoiceLine={line}
                        />
                      )
                    default:
                      return (
                        <InvoiceLinesEditorDefaultLine
                          key={line.id}
                          invoice={invoice}
                          index={index}
                          invoiceLine={line}
                        />
                      )
                  }
                })}
              </div>
            </SortableContext>
          </DndContext>
        </Form>
      </ScrollCard>
      <div className="flex flex-1 p-4">
        <div className="flex flex-1 items-center">
          <SplitButton
            title="Rechnungsposition hinzufügen"
            variant="outline"
            icon={RowInsertIcon}
            onClick={() => addLine(1)}
          >
            <MenuItem
              icon={CalculatorIcon}
              title="Standard-Rechnungsposition"
              onClick={() => addLine(1)}
            />
            <MenuItem
              icon={FirstBracketIcon}
              title="Überschreibarer Gesamtpreis"
              separator
              onClick={() => addLine(3)}
            />

            <MenuItem icon={HeadingIcon} title="Überschrift" onClick={() => addLine(2)} />
            <MenuItem icon={TextAlignJustifyLeftIcon} title="Text" onClick={() => addLine(4)} />
            <MenuItem
              icon={TextVerticalAlignmentIcon}
              title="Seitenumbruch"
              onClick={() => addLine(8)}
            />
          </SplitButton>
        </div>
        <div className="flex-none items-center justify-end space-x-2 px-2">
          <Button variant="outline" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button onClick={onSubmit}>Speichern</Button>
        </div>
      </div>
    </div>
  )
}
