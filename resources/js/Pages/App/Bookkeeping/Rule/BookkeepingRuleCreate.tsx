import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
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
        <FormGroup>
          <div className="col-span-16">
            <TextField label="Bezeichnung" {...form.register('name')} />
            <Checkbox {...form.registerCheckbox('is_active')} className="pt-1.5">
              Regel ist aktiv
            </Checkbox>
          </div>
          <div className="col-span-4">
            <TextField label="Priorität" {...form.register('priority')} />
          </div>
          <div className="col-span-4">
            <Select<Options>
              {...form.register('table')}
              label="Tabelle"
              itemValue="id"
              items={tables}
            />
          </div>
          {form.data.table === 'transactions' && (
            <div className="col-span-4">
              <Select<Options>
                {...form.register('amount_type')}
                label="Buchungsart"
                itemValue="id"
                items={amountTypes}
              />
            </div>
          )}
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default BookkeepingRuleCreate
