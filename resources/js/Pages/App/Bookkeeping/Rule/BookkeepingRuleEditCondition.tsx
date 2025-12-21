import { Plus, Trash2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/Components/twc-ui/button'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/select'
import { FormTextField } from '@/Components/twc-ui/text-field'

interface BookkeepingRuleEditConditionProps {
  conditions: App.Data.BookkeepingRuleConditionData[]
  fields: string[]
  ruleId: number
  onAddCondition: () => void
  onRemoveCondition: (index: number) => void
  onUpdateCondition: (
    index: number,
    field: keyof App.Data.BookkeepingRuleConditionData,
    value: any
  ) => void
}

interface Fields {
  id: string
  name: string
}

const logicalConditions: Fields[] = [
  { id: '=', name: '=' },
  { id: '<>', name: '<>' },
  { id: 'LIKE', name: 'LIKE' },
  { id: 'IN', name: 'IN' }
]

export const BookkeepingRuleEditCondition: React.FC<BookkeepingRuleEditConditionProps> = ({
  conditions,
  fields,
  ruleId,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition
}) => {
  const fieldsAsOptions: Fields[] = fields.map((field: string) => ({ id: field, name: field }))

  return (
    <FormGrid
      title="Bedingungen"
      action={
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onAddCondition}
          icon={Plus}
        />
      }
    >
      {conditions && conditions.length > 0 ? (
        conditions.map((condition, index) => (
          <React.Fragment key={condition.id || `new-${index}`}>
            <div className="col-span-8">
              <FormSelect<Fields>
                aria-label="Feld"
                name={`conditions.${index}.field`}
                items={fieldsAsOptions}
                value={condition.field}
                itemValue="id"
                onChange={value => onUpdateCondition(index, 'field', value)}
              />
            </div>
            <div className="col-span-4">
              <FormSelect<Fields>
                aria-label="Feld"
                name={`conditions.${index}.logical_operator`}
                items={logicalConditions}
                value={condition.logical_condition}
                itemValue="id"
                onChange={value => onUpdateCondition(index, 'logical_condition', value)}
              />
            </div>
            <div className="col-span-10">
              <FormTextField
                aria-label="Wert"
                name={`conditions.${index}.value`}
                value={condition.value}
                onChange={(value: string) => onUpdateCondition(index, 'value', value)}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCondition(index)}
                className="flex h-9 w-full items-center justify-center text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="E-Mail-Adresse löschen"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Versteckte Felder für Form-Handling */}
            <input type="hidden" name={`conditions.${index}.id`} value={condition.id || ''} />
            <input
              type="hidden"
              name={`conditions.${index}.rule_id`}
              value={condition.bookkeeping_rule_id}
            />
          </React.Fragment>
        ))
      ) : (
        <div />
      )}
    </FormGrid>
  )
}

export default BookkeepingRuleEditCondition
