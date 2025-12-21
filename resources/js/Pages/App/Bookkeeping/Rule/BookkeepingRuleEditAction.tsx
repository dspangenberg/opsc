import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/select'
import { FormTextField } from '@/Components/twc-ui/text-field'

interface BookkeepingRuleEditActionProps {
  actions: App.Data.BookkeepingRuleActionData[]
  fields: string[]
  ruleId: number
  onAddAction: () => void
  onRemoveAction: (index: number) => void
  onUpdateAction: (
    index: number,
    field: keyof App.Data.BookkeepingRuleActionData,
    value: any
  ) => void
}

interface Fields {
  id: string
  name: string
}

export const BookkeepingRuleEditAction: React.FC<BookkeepingRuleEditActionProps> = ({
  actions,
  fields,
  ruleId,
  onAddAction,
  onRemoveAction,
  onUpdateAction
}) => {
  const fieldsAsOptions: Fields[] = fields.map((field: string) => ({ id: field, name: field }))

  return (
    <FormGrid
      title="Aktionen"
      action={
        <Button type="button" variant="outline" size="icon-sm" onClick={onAddAction} icon={Plus} />
      }
    >
      {actions && actions.length > 0 ? (
        actions.map((action, index) => (
          <React.Fragment key={action.id || `new-${index}`}>
            <div className="col-span-8">
              <FormSelect<Fields>
                aria-label="Feld"
                name={`actions.${index}.field`}
                items={fieldsAsOptions}
                value={action.field}
                itemValue="id"
                onChange={value => onUpdateAction(index, 'field', value)}
              />
            </div>
            <div className="col-span-10">
              <FormTextField
                aria-label="Wert"
                name={`actions.${index}.value`}
                value={action.value}
                onChange={(value: string) => onUpdateAction(index, 'value', value)}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveAction(index)}
                className="flex h-9 w-full items-center justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="E-Mail-Adresse löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Versteckte Felder für Form-Handling */}
            <input type="hidden" name={`actions.${index}.id`} value={action.id || ''} />
            <input
              type="hidden"
              name={`actions.${index}.rule_id`}
              value={action.bookkeeping_rule_id}
            />
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </FormGrid>
  )
}

export default BookkeepingRuleEditAction
