import {
  CalculatorIcon,
  CashbackEuroIcon,
  FirstBracketIcon,
  HeadingIcon,
  RowInsertIcon,
  TextAlignJustifyLeftIcon,
  TextVerticalAlignmentIcon
} from '@hugeicons/core-free-icons'
import { ChevronDown } from 'lucide-react'
import type * as React from 'react'
import { BorderedBox } from '@/Components/twcui/bordered-box'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { Button } from '@/Components/ui/twc-ui/button'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { InvoiceLinesEditorDefaultLine } from '@/Pages/App/Invoice/InvoiceLinesEditorDefaultLine'
import { useInvoiceTable } from '@/Pages/App/Invoice/InvoiceTableProvider'
import { InvoiceLinesEditorLinkedInvoice } from './InvoiceLinesEditorLinkedInvoice'

interface InvoiceLinesEditorProps {
  invoice: App.Data.InvoiceData
}

export const InvoiceLinesEditor: React.FC<InvoiceLinesEditorProps> = ({ invoice }) => {
  const { amountNet, amountTax, amountGross, editMode, setEditMode, lines } = useInvoiceTable()

  const form = useForm<App.Data.InvoiceData>(
    'app.invoice.lines-update',
    'put',
    route('app.invoice.lines-update', {
      invoice: invoice.id
    }),

    invoice
  )

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
        <Form form={form}>
          <div className="divide-y">
            {lines.map((line, index: number) => {
              switch (line.type_id) {
                case 9:
                  return (
                    <InvoiceLinesEditorLinkedInvoice
                      key={line.id}
                      invoice={invoice}
                      index={index}
                      invoiceLine={line}
                    />
                  )
                case 1:
                case 2:
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
          <Button
            variant="outline"
            className="!rounded-r-none"
            title="Rechnungsposition hinzufügen"
            icon={RowInsertIcon}
          />
          <DropdownButton
            variant="outline"
            size="icon"
            iconClassName="size-4"
            icon={ChevronDown}
            className="!rounded-l-none !border-l-0 p-1"
          >
            <MenuItem icon={CalculatorIcon} title="Standard-Rechnungsposition" ellipsis />
            <MenuItem
              icon={FirstBracketIcon}
              title="Überschreibarer Gesamtpreis"
              ellipsis
              separator
            />

            <MenuItem icon={HeadingIcon} title="Überschrift" ellipsis isDisabled />
            <MenuItem icon={TextAlignJustifyLeftIcon} title="Text" ellipsis isDisabled />
            <MenuItem
              icon={TextVerticalAlignmentIcon}
              title="Seitenumbruch"
              ellipsis
              separator
              isDisabled
            />
            <MenuItem
              icon={CashbackEuroIcon}
              title="Mit Akonto-Zahlung verrechnen"
              isDisabled={invoice.type_id !== 3}
              href={route('app.invoice.link-on-account-invoice', { invoice: invoice.id })}
              ellipsis
            />
          </DropdownButton>
        </div>
        <div className="flex-none items-center justify-end space-x-2 px-2">
          <Button variant="outline" onClick={() => setEditMode(false)}>
            Abbrechen
          </Button>
          <Button type="submit" form={form.id}>
            Speichern
          </Button>
        </div>
      </div>
    </div>
  )
}
