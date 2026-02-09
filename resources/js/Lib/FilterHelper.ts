import { parseDate } from '@internationalized/date'

export interface FilterItem {
  operator: string
  value: any
}

export type FilterConfig = {
  filters: Record<string, FilterItem>
  boolean?: 'AND' | 'OR'
}

export const parseFilterDateRange = (issuedBetween: any) => {
  if (
    Array.isArray(issuedBetween) &&
    issuedBetween.length === 2 &&
    issuedBetween[0] &&
    issuedBetween[1]
  ) {
    try {
      return {
        start: parseDate(issuedBetween[0].split('T')[0]),
        end: parseDate(issuedBetween[1].split('T')[0])
      }
    } catch (e) {
      console.error('Error parsing date range', e)
    }
  }
  return null
}

export const getUpdatedFilters = (
  filters: FilterConfig,
  key: string,
  item: FilterItem | null
): FilterConfig => {
  const newFilters = { ...(filters?.filters || {}) }

  if (item === null) {
    delete newFilters[key]
  } else {
    newFilters[key] = item
  }

  return {
    filters: newFilters,
    boolean: filters?.boolean || 'AND'
  }
}

export const getFilterBadgeLabel = (
  key: string,
  filter: FilterItem,
  options: {
    contacts?: App.Data.ContactData[]
    accounts?: App.Data.BookkeepingAccountData[]
    cost_centers?: App.Data.CostCenterData[]
    currencies?: App.Data.CurrencyData[]
  } = {}
): string => {
  switch (key) {
    case 'is_unpaid':
      return 'nur unbezahlte'
    case 'issuedBetween':
      return `Datum: ${new Date(filter.value[0]).toLocaleDateString('de-DE')} - ${new Date(filter.value[1]).toLocaleDateString('de-DE')}`
    case 'contact_id':
      return `Kreditor: ${options.contacts?.find(c => c.id === filter.value)?.reverse_full_name || filter.value}`
    case 'cost_center_id':
      return `Kostenstelle: ${options.cost_centers?.find(cc => cc.id === filter.value)?.name || filter.value}`
    case 'org_currency':
      return `Währung: ${filter.value}`
    case 'counter_account_id':
      return Number(filter.value) === 0 ? 'ohne Gegenkonto' : `Konto: ${filter.value}`
    case 'is_locked':
      return 'nur unbestätigt'
    case 'hide_private':
      return 'private Transaktionen ausblenden'
    case 'hide_transit':
      return 'Geldtransit ausblenden'
    case 'withoutBookings':
      return 'ohne Buchung'
    case 'account_id_credit':
      return `Habenkonto: ${options.accounts?.find(a => a.account_number === filter.value)?.name || filter.value}`
    case 'account_id_debit':
      return `Sollkonto: ${options.accounts?.find(a => a.account_number === filter.value)?.name || filter.value}`
    default:
      return `${key}: ${filter.value}`
  }
}
