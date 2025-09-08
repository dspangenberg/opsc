import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { X } from 'lucide-react'
import type * as React from 'react'
import { useMemo } from 'react'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Popover, PopoverDialog, PopoverTrigger } from '@/Components/ui/twc-ui/popover'

interface Props {
  accounts: App.Data.BookkeepingAccountData[]
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
}

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }>
  boolean?: 'AND' | 'OR'
}

type FormData = {
  counter_account_id: number | null
  is_locked: number
  without_counter_account: number
}

export const TransactionIndexFilterForm: React.FC<Props> = ({
  accounts,
  filters,
  onFiltersChange
}) => {
  // Aktuelle Filterwerte aus dem filters-Objekt extrahieren
  const currentFilters = useMemo(
    () => ({
      counter_account_id:
        filters.filters.counter_account_id && filters.filters.counter_account_id.operator !== 'null'
          ? filters.filters.counter_account_id.value
          : null,
      is_locked: filters.filters.is_locked ? 1 : 0,
      without_counter_account:
        filters.filters.counter_account_id && filters.filters.counter_account_id.value === 0 ? 1 : 0
    }),
    [filters]
  )

  const form = useForm<FormData>('transaction-filter-form', 'post', '', currentFilters)

  // Anzahl der aktiven Filter berechnen
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters.filters).length
  }, [filters])

  const handleFilterChange = (field: keyof FormData, value: any) => {
    const newFilters = { ...filters.filters }

    if (field === 'counter_account_id') {
      if (value) {
        newFilters.counter_account_id = {
          operator: '=',
          value: value
        }
      } else {
        // Remove any counter_account_id filter (either specific or null)
        delete newFilters.counter_account_id
      }
    } else if (field === 'is_locked') {
      if (value) {
        newFilters.is_locked = {
          operator: '=',
          value: 0
        }
      } else {
        delete newFilters.is_locked
      }
    } else if (field === 'without_counter_account') {
      if (value) {
        newFilters.counter_account_id = {
          operator: '=',
          value: 0
        }
      } else {
        // On uncheck, always remove counter_account_id filter (it was set to '= 0')
        delete newFilters.counter_account_id
      }
    }

    onFiltersChange({
      ...filters,
      filters: newFilters
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      filters: {},
      boolean: 'AND'
    })
    form.reset()
  }

  return (
    <PopoverTrigger>
      <Button variant="outline" size="sm" icon={FilterHorizontalIcon}>
        Filter
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
      <Popover>
        <PopoverDialog className="max-w-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter</h4>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} icon={X}>
                  Zurücksetzen
                </Button>
              )}
            </div>

            <Form form={form}>
              <FormGroup>
                {/* Status Filter */}
                <div className="col-span-24 space-y-2">
                  <div className="space-y-2">
                    <Checkbox
                      isSelected={currentFilters.is_locked === 1}
                      label="Nur unbestätigte Transaktionen"
                      name="is_locked"
                      onChange={checked => handleFilterChange('is_locked', Number(checked))}
                    />
                    <Checkbox
                      label="nur Transaktionen ohne Gegenkonto"
                      name="without_counter_account"
                      isSelected={currentFilters.without_counter_account === 1}
                      onChange={checked =>
                        handleFilterChange('without_counter_account', Number(checked))
                      }
                    />
                  </div>
                </div>
              </FormGroup>
            </Form>

            {/* Aktive Filter anzeigen */}
            {activeFiltersCount > 0 && (
              <div className="border-t pt-3">
                <div className="mb-2 text-muted-foreground text-sm">
                  Aktive Filter ({activeFiltersCount})
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(filters.filters).map(([key, filter]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key === 'counter_account_id' &&
                        filter.operator !== 'null' &&
                        (Number(filter.value) === 0
                          ? 'ohne Gegenkonto'
                          : `Konto: ${accounts.find(a => a.id === filter.value)?.account_number || filter.value}`)}
                      {key === 'counter_account_id' &&
                        filter.operator === 'null' &&
                        'ohne Gegenkonto'}
                      {key === 'is_locked' && 'nur unbestätigt'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverDialog>
      </Popover>
    </PopoverTrigger>
  )
}
