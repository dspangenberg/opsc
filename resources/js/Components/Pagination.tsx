import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/Components/ui/pagination'
import { cn } from '@/Lib/utils'
import type { HugeiconsProps } from '@hugeicons/react'

import type { TabsProps, TabsTriggerProps } from '@radix-ui/react-tabs'
import type React from 'react'
import type { ReactNode } from 'react'

type ReactNodeOrString = ReactNode | string

interface PaginatorProps<T> extends TabsProps {
  data: App.Data.Paginated.PaginationMeta<T>
}

export const Pagination = <T,>({ data }: PaginatorProps<T>) => {
  const pages = data.links.slice(1, -1) // Remove first and last elements

  return (
    <ShadcnPagination className="p-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={data.prev_page_url} disabled={data.current_page === 1} />
        </PaginationItem>
        {pages.map((link, index) => (
          <PaginationItem key={index}>
            <PaginationLink 
              href={link.url} 
              isActive={link.active}
            >
              {link.label}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={data.next_page_url} disabled={data.current_page === data.last_page} />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  )
}
