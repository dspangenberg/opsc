import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Form, useForm } from '@/Components//twc-ui/form'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  rule: App.Data.BookkeepingRuleData
}

interface Options extends Record<string, unknown> {
  id: string
  name: string
}

const tables: Options[] = [
  { id: 'transactions', name: 'transactions' },
  { id: 'receipts', name: 'receipts' },
  { id: 'bookings', name: 'bookings' }
]

const amountTypes: Options[] = [
  { id: 'all', name: 'all' },
  { id: 'debit', name: 'Lastschrift' },
  { id: 'credit', name: 'Gutschrift' }
]

const BookkeepingRuleCreate: React.FC<Props> = ({ rule }) => {
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.BookkeepingRuleData>(
    'form-rule-edit',
    'post',
    route('app.bookkeeping.rules.store'),
    rule
  )

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.bookkeeping.rules.index'))
  }

  const ruleType = (table: string) => {
    switch (table) {
      case 'transactions':
        return 'Transaktionen'
      case 'receipts':
        return 'Belege'
      default:
        return 'Unbekannt'
    }
  }

  const title = `Regel für ${ruleType(rule.table)}  bearbeiten`

  return (
    <Dialog
      isOpen={isOpen}
      onClosed={handleClose}
      title={title}
      confirmClose={form.isDirty}
      footer={dialogRenderProps => (
        <div className="mx-0 flex w-full gap-2">
          <div className="flex flex-1 justify-start" />
          <div className="flex flex-none gap-2">
            <Button variant="outline" onClick={dialogRenderProps.close}>
              Abbrechen
            </Button>
            <Button variant="default" form={form.id} type="submit" isLoading={form.processing}>
              Speichern
            </Button>
          </div>
        </div>
      )}
    >
      <Form form={form} onSubmitted={() => setIsOpen(false)}>
        <FormGrid>
          <div className="col-span-16">
            <FormTextField label="Bezeichnung" {...form.register('name')} />
            <Checkbox {...form.registerCheckbox('is_active')} className="pt-1.5">
              Regel ist aktiv
            </Checkbox>
          </div>
          <div className="col-span-4">
            <FormTextField label="Priorität" {...form.register('priority')} />
          </div>
          <div className="col-span-4">
            <FormSelect<Options>
              {...form.register('table')}
              label="Tabelle"
              itemValue="id"
              items={tables}
            />
          </div>
          {form.data.table === 'transactions' && (
            <div className="col-span-4">
              <FormSelect<Options>
                {...form.register('amount_type')}
                label="Buchungsart"
                itemValue="id"
                items={amountTypes}
              />
            </div>
          )}
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default BookkeepingRuleCreate
