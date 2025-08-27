import {
  CalculatorIcon,
  CashbackEuroIcon,
  FirstBracketIcon,
  HeadingIcon,
  RowInsertIcon,
  TextAlignJustifyLeftIcon,
  TextVerticalAlignmentIcon
} from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import type * as React from 'react'
import { DropdownButton, MenuItem } from '@/Components/twcui/dropdown-button'
import { AlertDialog } from '@/Components/ui/twc-ui/alert-dialog'
import { Button } from '@/Components/ui/twc-ui/button'
import { InvoiceDetailsLayout } from '@/Pages/App/Invoice/InvoiceDetailsLayout'
import { InvoiceDetailsSide } from '@/Pages/App/Invoice/InvoiceDetailsSide'
import { InvoicingTable, type LineCommandProps } from '@/Pages/App/Invoice/InvoicingTable'
import type { PageProps } from '@/Types'

interface InvoiceDetailsProps extends PageProps {
  invoice: App.Data.InvoiceData
  children?: React.ReactNode
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ children }) => {
  const { invoice } = usePage<InvoiceDetailsProps>().props

  const handeLineCommand = async (props: LineCommandProps) => {
    if (props.command === 'edit') {
      router.get(route('app.invoice.line-edit', { invoice: invoice.id, invoiceLine: props.lineId }))
    }

    if (props.command === 'delete') {
      const promise = await AlertDialog.call({
        title: 'Rechnungsposition löschen',
        message: 'Möchtest Du die Rechnungsposition wirklich löschen?',
        buttonTitle: 'Position löschen'
      })
      if (promise) {
        router.delete(
          route('app.invoice.line-delete', { invoice: invoice.id, invoiceLine: props.lineId })
        )
      }
    }

    // app.invoice.create.payment

    if (props.command === 'duplicate') {
      router.get(
        route('app.invoice.line-duplicate', { invoice: invoice.id, invoiceLine: props.lineId })
      )
    }
  }

  return (
    <InvoiceDetailsLayout invoice={invoice}>
      <div className="flex-1">
        {children}
        <InvoicingTable invoice={invoice} onLineCommand={handeLineCommand} />
        <div className="flex items-center p-4">
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
            <MenuItem icon={CalculatorIcon} title="Standard-Rechnungsposition" ellipsis separator />
            <MenuItem
              icon={FirstBracketIcon}
              title="Überschreibarer Gesamtpreis"
              ellipsis
              separator
            />

            <MenuItem icon={HeadingIcon} title="Überschrift" ellipsis />
            <MenuItem icon={TextAlignJustifyLeftIcon} title="Text" ellipsis />
            <MenuItem icon={TextVerticalAlignmentIcon} title="Seitenumbruch" ellipsis separator />
            <MenuItem icon={CashbackEuroIcon} title="Mit Akonto-Zahlung verrechnen" ellipsis />
          </DropdownButton>
        </div>
      </div>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <InvoiceDetailsSide invoice={invoice} />
      </div>
    </InvoiceDetailsLayout>
  )
}

export default InvoiceDetails
