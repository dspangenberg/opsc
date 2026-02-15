import type { FC } from 'react'
import { HoverCardContent } from '@/Components/hover-card'
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm
} from '@/Components/twc-ui/description-list'
import { Badge } from '@/Components/ui/badge'

interface InvoiceIndexHoverCardProps {
  invoice: App.Data.InvoiceData
}

export const InvoiceIndexHoverCard: FC<InvoiceIndexHoverCardProps> = ({
  invoice
}: InvoiceIndexHoverCardProps) => {
  return (
    <HoverCardContent className="w-xs">
      <div className="text-right">
        <Badge variant="outline">{invoice.booking?.document_number}</Badge>
      </div>
      <DescriptionList>
        <DescriptionTerm>Sollkonto:</DescriptionTerm>
        <DescriptionDetails> {invoice.booking?.account_debit?.label}</DescriptionDetails>
        <DescriptionTerm>Habenkonto:</DescriptionTerm>
        <DescriptionDetails> {invoice.booking?.account_credit?.label}</DescriptionDetails>
      </DescriptionList>
    </HoverCardContent>
  )
}
