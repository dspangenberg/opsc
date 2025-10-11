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
import BookkeepingRuleEditAction from '@/Pages/App/Bookkeeping/Rule/BookkeepingRuleEditAction'
import type { PageProps } from '@/Types'
import BookkeepingRuleEditCondition from './BookkeepingRuleEditCondition'

interface Props extends PageProps {
  rule: App.Data.BookkeepingRuleData
  fields?: string[]
}

interface Options extends Record<string, unknown> {
  id: string
  name: string
}

const logicalOperators: Options[] = [
  { id: 'and', name: 'und' },
  { id: 'or', name: 'oder' }
]

const BookkeepingRuleEdit: React.FC<Props> = ({ rule, fields }) => {
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

  const addCondition = () => {
    const newCondition: App.Data.BookkeepingRuleConditionData = {
      id: null,
      bookkeeping_rule_id: form.data.id as number,
      field: '',
      logical_condition: '=',
      value: ''
    }

    const updatedConditions = [...(form.data.conditions || []), newCondition]
    form.setData('conditions', updatedConditions)
  }

  const addAction = () => {
    const newAction: App.Data.BookkeepingRuleActionData = {
      id: null,
      bookkeeping_rule_id: form.data.id as number,
      field: '',
      value: ''
    }

    const updatedActions = [...(form.data.actions || []), newAction]
    form.setData('actions', updatedActions)
  }

  const removeConditions = (index: number) => {
    const updatedConditions = form.data.conditions?.filter((_, i) => i !== index)
    form.setData('conditions', updatedConditions as App.Data.BookkeepingRuleConditionData[])
  }

  const removeAction = (index: number) => {
    const updatedActions = form.data.actions?.filter((_, i) => i !== index)
    form.setData('actions', updatedActions as App.Data.BookkeepingRuleActionData[])
  }

  const updateConditions = (
    index: number,
    field: keyof App.Data.BookkeepingRuleConditionData,
    value: any
  ) => {
    console.log(index, field, value)
    const updatedConditions = form.data.conditions?.map((condition, i) => {
      if (i === index) {
        return {
          ...condition,
          [field]: value
        }
      }
      return condition
    })

    form.setData('conditions', updatedConditions as App.Data.BookkeepingRuleConditionData[])
  }

  const updateAction = (
    index: number,
    field: keyof App.Data.BookkeepingRuleActionData,
    value: any
  ) => {
    console.log(index, field, value)
    const updatedActions = form.data.actions?.map((action, i) => {
      if (i === index) {
        return {
          ...action,
          [field]: value
        }
      }
      return action
    })

    form.setData('actions', updatedActions as App.Data.BookkeepingRuleActionData[])
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
            <Select<Options, string>
              {...form.register('logical_operator')}
              label="Boolean"
              valueType="string"
              items={logicalOperators}
            />
          </div>
        </FormGroup>

        <BookkeepingRuleEditCondition
          conditions={form.data.conditions || []}
          fields={fields as string[]}
          ruleId={rule.id as number}
          onAddCondition={addCondition}
          onRemoveCondition={index => removeConditions(index)}
          onUpdateCondition={updateConditions}
        />

        <BookkeepingRuleEditAction
          actions={form.data.actions || []}
          fields={fields as string[]}
          ruleId={rule.id as number}
          onAddAction={addAction}
          onRemoveAction={index => removeAction(index)}
          onUpdateAction={updateAction}
        />
      </Form>
    </Dialog>
  )
}

export default BookkeepingRuleEdit
