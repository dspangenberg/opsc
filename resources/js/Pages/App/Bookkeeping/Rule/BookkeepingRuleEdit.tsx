import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { ComboBox } from '@/Components/ui/twc-ui/combo-box'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  rule: App.Data.BookkeepingRuleData
  fields?: string[]
}

const BookkeepingRuleEdit: React.FC<Props> = ({ rule, fields }) => {
  const title = rule.id ? 'Regel bearbeiten' : 'Neue Regel hinzufügen'
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.BookkeepingRuleData>(
    'form-rule-edit',
    rule.id ? 'put' : 'post',
    route(rule.id ? 'app.bookkeeping.rules.update' : 'app.bookkeeping.rules.store', {
      id: rule.id
    }),
    rule
  )

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.bookkeeping.rules.index'))
  }

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
          <div className="col-span-24">
            <TextField label="Bezeichnung" {...form.register('name')} />
          </div>
        </FormGroup>
        <FormGroup title="Konditionen">
          {rule.conditions?.map((condition, index) => (
            <div key={index} className="col-span-24 block">
              {condition.field} {condition.logical_condition} {condition.value}
            </div>
          ))}
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default BookkeepingRuleEdit
