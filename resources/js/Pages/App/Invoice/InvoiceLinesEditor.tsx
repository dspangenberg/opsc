import {
  CalculatorIcon,
  FirstBracketIcon,
  HeadingIcon,
  RowInsertIcon,
  TextAlignJustifyLeftIcon,
  TextVerticalAlignmentIcon
} from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { MenuItem } from '@/Components/twc-ui/menu'
import { SplitButton } from '@/Components/twc-ui/split-button'
import { BorderedBox } from '@/Components/twcui/bordered-box'
import { InvoiceLinesEditorDefaultLine } from '@/Pages/App/Invoice/InvoiceLinesEditorDefaultLine'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'
import { InvoiceLinesEditorCaptionLine } from './InvoiceLinesEditorCaptionLine'
import { InvoiceLinesEditorTextLine } from './InvoiceLinesEditorTextLine'

interface InvoiceLinesEditorProps {
  invoice: App.Data.InvoiceData
}

export const InvoiceLinesEditor: React.FC<InvoiceLinesEditorProps> = ({ invoice }) => {
  const { amountNet, amountTax, amountGross, editMode, setEditMode, lines, addLine } =
    useInvoiceTable()

  const form = useForm<App.Data.InvoiceData>(
    'app.invoice.lines-update',
    'put',
    route('app.invoice.lines-update', {
      invoice: invoice.id
    }),

    invoice
  )

  const onSubmit = () => {
    form.transform(data => ({
      ...data,
      lines
    }))

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
      {amountNet} {amountTax} {amountGross} Edit: {(editMode as boolean) ? 'true' : 'false'}{' '}
      <BorderedBox className="flex flex-1 overflow-y-hidden" innerClassName="bg-white">
        <div className="grid grid-cols-24 gap-x-3 border-b bg-sidebar px-13 py-2.5 font-medium text-sm">
          <div className="col-span-3">Menge</div>
          <div className="col-span-2">Einheit</div>
          <div className="col-span-10">Beschreibung</div>
          <div className="col-span-4">Einzelpreis</div>
          <div className="col-span-4">Gesamtpreis</div>
          <div>USt.</div>
        </div>
        <Form form={form} errorVariant="field">
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
        </Form>
      </BorderedBox>
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
            <MenuItem icon={TextVerticalAlignmentIcon} title="Seitenumbruch" isDisabled />
          </SplitButton>
        </div>
        <div className="flex-none items-center justify-end space-x-2 px-2">
          <Button variant="outline" onClick={() => setEditMode(false)}>
            Abbrechen
          </Button>
          <Button onClick={onSubmit}>Speichern</Button>
        </div>
      </div>
    </div>
  )
}
