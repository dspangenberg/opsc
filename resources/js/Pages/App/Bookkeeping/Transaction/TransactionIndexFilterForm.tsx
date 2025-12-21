import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { X } from 'lucide-react'
import type * as React from 'react'
import { useMemo } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { Popover, PopoverDialog, PopoverTrigger } from '@/Components/twc-ui/popover'
import { Badge } from '@/Components/ui/badge'

interface Props {
  accounts: App.Data.BookkeepingAccountData[]
  filters: FilterConfig
  onFiltersChange: (filters: FilterConfig) => void
  bankAccountId: number
  currentSearch?: string
}

type FilterConfig = {
  filters: Record<string, { operator: string; value: any }>
  boolean?: 'AND' | 'OR'
}

export const TransactionIndexFilterForm: React.FC<Props> = ({
  accounts,
  filters,
  onFiltersChange,
  bankAccountId,
  currentSearch = ''
}) => {
  // Aktuelle Filterwerte extrahieren mit defensiver Programmierung
  const currentFilters = useMemo(
    () => ({
      is_locked: !!filters?.filters?.is_locked,
      without_counter_account:
        filters?.filters?.counter_account_id?.operator === '=' &&
        filters?.filters?.counter_account_id?.value === 0,
      hide_private: !!filters?.filters?.hide_private
    }),
    [filters?.filters]
  )

  // Anzahl der aktiven Filter berechnen
  const activeFiltersCount = useMemo(() => {
    return Object.keys(filters?.filters || {}).length
  }, [filters?.filters])

  const handleFilterChange = (field: string, value: boolean) => {
    const newFilters = { ...(filters?.filters || {}) }

    switch (field) {
      case 'is_locked':
        if (value) {
          newFilters.is_locked = { operator: '=', value: 0 }
        } else {
          delete newFilters.is_locked
        }
        break

      case 'without_counter_account':
        if (value) {
          newFilters.counter_account_id = { operator: '=', value: 0 }
        } else {
          delete newFilters.counter_account_id
        }
        break

      case 'hide_private':
        if (value) {
          newFilters.hide_private = { operator: 'scope', value: true }
        } else {
          delete newFilters.hide_private
        }
        break
    }

    const updatedFilterConfig = {
      filters: newFilters,
      boolean: filters?.boolean || 'AND'
    }

    onFiltersChange(updatedFilterConfig)
  }

  const handleClearFilters = () => {
    const emptyFilters = {
      filters: {},
      boolean: 'AND' as const
    }
    onFiltersChange(emptyFilters)
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

            <FormGrid>
              <div className="col-span-24 space-y-2">
                <div className="space-y-2">
                  <Checkbox
                    isSelected={currentFilters.is_locked}
                    name="is_locked"
                    onChange={checked => handleFilterChange('is_locked', checked)}
                  >
                    Nur unbestätigte Transaktionen
                  </Checkbox>

                  <Checkbox
                    isSelected={currentFilters.without_counter_account}
                    name="without_counter_account"
                    onChange={checked => handleFilterChange('without_counter_account', checked)}
                  >
                    Nur Transaktionen ohne Gegenkonto
                  </Checkbox>

                  <Checkbox
                    isSelected={currentFilters.hide_private}
                    name="hide_private"
                    onChange={checked => handleFilterChange('hide_private', checked)}
                  >
                    Private Transaktionen ausblenden
                  </Checkbox>
                </div>
              </div>
            </FormGrid>

            {/* Aktive Filter anzeigen */}
            {activeFiltersCount > 0 && (
              <div className="border-t pt-3">
                <div className="mb-2 text-muted-foreground text-sm">
                  Aktive Filter ({activeFiltersCount})
                </div>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(filters?.filters || {}).map(([key, filter]) => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key === 'counter_account_id' &&
                        (Number(filter.value) === 0 ? 'ohne Gegenkonto' : `Konto: ${filter.value}`)}
                      {key === 'is_locked' && 'nur unbestätigt'}
                      {key === 'hide_private' && 'private Transaktionen ausblenden'}
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
