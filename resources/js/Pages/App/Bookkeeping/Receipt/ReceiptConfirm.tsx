import { router } from '@inertiajs/react'
import type * as React from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { PdfViewerContainer } from '@/Components/PdfViewerContainer'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { ComboBox } from '@/Components/ui/twc-ui/combo-box'
import { DatePicker } from '@/Components/ui/twc-ui/date-picker'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { NumberField } from '@/Components/ui/twc-ui/number-field'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  receipt: App.Data.ReceiptData
  nextReceipt: string
  prevReceipt: string
  contacts: App.Data.ContactData[]
  cost_centers: App.Data.CostCenterData[]
  currencies: App.Data.CurrencyData[]
  file: string
}

const ReceiptConfirm: React.FC<Props> = ({
  receipt,
  contacts,
  nextReceipt,
  cost_centers,
  currencies
}) => {
  const form = useForm<App.Data.ReceiptData>(
    'update-receipt',
    'put',
    route('app.bookkeeping.receipts.update', {
      id: receipt.id,
      _query: { confirm: true, load_next: true }
    }),
    receipt
  )

  console.log(receipt)

  const handleSubmitted = () => {
    ;(form.reset as unknown as () => void)()
  }

  const handleNextReceipt = () => {
    if (nextReceipt) {
      router.visit(nextReceipt)
    } else {
      router.visit(route('app.bookkeeping.receipts.index'))
    }
  }

  return (
    <PageContainer title="Beleg bestätigen" width="7xl" className="flex overflow-hidden">
      <PdfViewerContainer
        document={route('app.bookkeeping.receipts.pdf', { receipt: receipt.id })}
        filename={receipt.org_filename}
      />
      <Form form={form} className="flex-1">
        <FormGroup>
          <div className="col-span-8">
            <DatePicker label="Rechnungsdatum" {...form.register('issued_on')} />
          </div>
          <div className="col-span-8">
            <Select<App.Data.CurrencyData>
              {...form.register('org_currency')}
              label="Währung"
              itemValue="code"
              itemName="code"
              items={currencies}
            />
          </div>
          <div className="col-span-8">
            <NumberField label="Bruttobetrag" {...form.register('amount')} />
          </div>
          <div className="col-span-24">
            <TextField label="Referenz" {...form.register('reference')} />
          </div>
          <div className="col-span-24">
            <ComboBox<App.Data.ContactData>
              {...form.register('contact_id')}
              label="Kreditor"
              itemName="full_name"
              items={contacts}
            />
          </div>
          <div className="col-span-24">
            <ComboBox<App.Data.CostCenterData>
              {...form.register('cost_center_id')}
              label="Kostenstelle"
              items={cost_centers}
            />
            <Checkbox {...form.registerCheckbox('is_confirmed')} className="pt-1.5">
              Beleg bestätigen und buchen
            </Checkbox>
          </div>
        </FormGroup>

        <Button variant="outline" onClick={handleNextReceipt}>
          Überspringen
        </Button>
        <Button variant="default" form={form.id} type="submit" isLoading={form.processing}>
          Speichern + Bestätigen
        </Button>
      </Form>
    </PageContainer>
  )
}

export default ReceiptConfirm
