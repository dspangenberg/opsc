import { Add01Icon, ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { getYear } from 'date-fns'
import { debounce, sumBy } from 'lodash'
import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { DataTable } from '@/Components/DataTable'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Select } from '@/Components/twc-ui/select'
import { Toolbar } from '@/Components/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { columns } from './OfferIndexColumns'

interface OfferIndexProps extends PageProps {
  offers: App.Data.Paginated.PaginationMeta<App.Data.OfferData[]>
  years: number[]
  currentYear: number
}

interface YearsProps extends Record<string, unknown> {
  id: number
  name: string
}

interface ViewProps extends Record<string, unknown> {
  id: number
  name: string
  is_default?: boolean
}

const OfferIndex: React.FC<OfferIndexProps> = ({ offers, years, currentYear }) => {
  const minYear = Math.min(...years)
  const [year, setYear] = React.useState<number>(currentYear)
  const [view, setView] = React.useState<number>(1)
  const [selectedRows, setSelectedRows] = React.useState<App.Data.OfferData[]>([])

  const localCurrentYear = getYear(new Date())

  const handlePreviousYear = useCallback(() => {
    const newYear = Number(year) === 0 ? localCurrentYear - 1 : year - 1
    setYear(newYear)

    // setYear(prevYear => Math.max(currentYear - 10, Number(prevYear) - 1))
  }, [setYear, year, localCurrentYear])

  const handleNextYear = useCallback(() => {
    const newYear =
      Number(year) === 0 ? localCurrentYear : Number.parseInt(year as unknown as string) + 1
    setYear(_prevYear => newYear)
  }, [localCurrentYear, setYear, year])

  useEffect(() => {
    const debouncedNavigate = debounce(() => {
      if (year !== currentYear) {
        router.get(route('app.invoice.index', { _query: { view: route().queryParams.view, year } }))
      }
    }, 300) // 300ms delay

    debouncedNavigate()

    return () => {
      debouncedNavigate.cancel()
    }
  }, [year])

  const yearItems = useMemo(() => {
    const items = years.map(year => ({
      id: year,
      name: year.toString()
    }))
    items.push({
      id: 0,
      name: 'Alle'
    })
    return items
  }, [])

  const breadcrumbs = useMemo(
    () => [
      {
        title: 'Angebote',
        route: route('app.offer.index')
      }
    ],
    []
  )

  const handleOfferCreateClicked = useCallback(() => {
    router.visit(route('app.offer.create'))
  }, [])

  const toolbar = useMemo(
    () => (
      <Toolbar>
        <Button
          variant="toolbar-default"
          icon={Add01Icon}
          title="Neues Angebot"
          onClick={handleOfferCreateClicked}
        />
      </Toolbar>
    ),
    [handleOfferCreateClicked]
  )

  return (
    <PageContainer
      title="Angebote"
      width="7xl"
      breadcrumbs={breadcrumbs}
      className="flex overflow-hidden"
      toolbar={toolbar}
      header={
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-none items-center gap-1 font-bold text-xl">
            Angebote&nbsp;
            <Button
              variant="ghost"
              size="icon"
              icon={ArrowLeft01Icon}
              onClick={handlePreviousYear}
              disabled={year <= minYear}
            />
            <Select<YearsProps>
              className="w-20"
              aria-label="Jahr"
              name="year"
              value={Number(year)}
              items={yearItems}
              onChange={value => setYear(Number(value))}
            />
            <Button
              variant="ghost"
              size="icon"
              icon={ArrowRight01Icon}
              onClick={handleNextYear}
              disabled={year >= localCurrentYear}
            />
          </div>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={offers.data}
        onSelectedRowsChange={setSelectedRows}
        itemName="Angebote mit den Suchkriterien"
      />
    </PageContainer>
  )
}

export default OfferIndex
