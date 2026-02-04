import type React from 'react'
import { cn } from '@/Lib/utils'

const DescriptionList = ({ className, ref, ...props }: React.ComponentProps<'dl'>) => {
  return <dl ref={ref} className={cn('text-sm space-y-0', className)} {...props} />
}

const DescriptionTerm = ({ className, ref, ...props }: React.ComponentProps<'dt'>) => {
  return <dt ref={ref} className={cn('text-muted-fg', className)} {...props} />
}

const DescriptionDetails = ({ className, ...props }: React.ComponentProps<'dd'>) => {
  return (
    <dd {...props} data-slot="description-details" className={cn('mb-2 font-medium', className)} />
  )
}

export { DescriptionList, DescriptionTerm, DescriptionDetails }
