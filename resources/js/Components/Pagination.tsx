import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/Components/ui/pagination'
import React, { useState } from 'react'
import { FormSelect } from '@dspangenberg/twcui'

interface PaginatorProps<T> {
  data: App.Data.Paginated.PaginationMeta<T>
  itemName?: string
  selected?: number
}

export const Pagination = <T,>({ data, itemName = 'Datensätze', selected = 0 }: PaginatorProps<T>) => {
  const pages = data.links.slice(1, -1) // Remove first and last elements
  const [recordsPerPage, setRecordsPerPage] = useState('10')

  const options: { value: string; label: string }[] = [
    {
      value: '10',
      label: '10/Seite'
    },
    {
      value: '25',
      label: '25/Seite'
    },
    {
      value: '50',
      label: '50/Seite'
    }
  ]

  return (
    <div className="flex flex-none items-center px-4 py-2">
      <div className="flex-1 items-center flex">
        <div className="flex items-center gap-1 text-sm text-foreground">
          {data.total > 0 && (
            <>
              {data.from}-{data.to} von {data.total} {itemName}
              {selected > 0 && ` (${selected} ausgewählt)`}
            </>
          )}
        </div>
      </div>
      <div className="flex-2">
        <ShadcnPagination>
          <PaginationContent className="mx-auto">
            <PaginationItem>
              <PaginationPrevious href={pages[0]?.url || '#'} disabled={data.current_page === 1} />
            </PaginationItem>
            {pages.map((link, index) => (
              <PaginationItem key={index}>
                <PaginationLink href={link.url || '#'} isActive={link.active}>
                  {link.label}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={pages[pages.length - 1]?.url || '#'}
                disabled={data.current_page === data.last_page}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadcnPagination>
      </div>
      <div className="flex-1 flex justify-end">
        <FormSelect
          options={options}
          value={recordsPerPage}
          className="w-auto"
          onValueChange={(value: string) => setRecordsPerPage(value)}
        />
      </div>
    </div>
  )
}
