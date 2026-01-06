import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadcnPagination
} from '@/Components/ui/pagination'

interface PaginatorProps<T> {
  data: App.Data.Paginated.PaginationMeta<T>
  itemName?: string
  selected?: number
}

export const Pagination = <T,>({
  data,
  itemName = 'Datensätze',
  selected = 0
}: PaginatorProps<T>) => {
  const pages = data.links.slice(1, -1) // Remove first and last elements

  return (
    <div className="flex flex-none items-center px-4 py-2">
      <div className="flex flex-1 items-center">
        <div className="flex items-center gap-1 text-foreground text-sm">
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
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={data.prev_page_url || '#'}
                disabled={data.current_page === 1}
              />
            </PaginationItem>
            {pages.map((link, index) => (
              <PaginationItem key={index}>
                {link.label === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink href={link.url || '#'} isActive={link.active}>
                    {link.label}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={data.next_page_url || '#'}
                disabled={data.current_page === data.last_page}
              />
            </PaginationItem>
          </PaginationContent>
        </ShadcnPagination>
      </div>
    </div>
  )
}
