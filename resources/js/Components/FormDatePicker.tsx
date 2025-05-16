import { Button, FormLabel } from '@dspangenberg/twcui'
import { Calendar } from '@/Components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { cn } from '@/Lib/utils'
import { format, parse } from 'date-fns'
import { de } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { forwardRef } from 'react'

interface FormDatePickerProps {
  value: string
  onChange: (date: string) => void
  error?: string
  className?: string
  label?: string
  help?: string
  required?: boolean
}

export const FormDatePicker = forwardRef<HTMLButtonElement, FormDatePickerProps>(
  ({ required = false, className = '', help = '', label, error = '', value, onChange }, ref) => {

    const parsedDate = value ? parse(value, 'dd.MM.yyyy', new Date()) : undefined
    const [dateValue, setDateValue] = React.useState<Date | undefined>(parsedDate)

    const handleSelect = (selectedDate: Date | undefined) => {
      console.log('Date selected:', selectedDate)
      setDateValue(selectedDate)
      if (selectedDate) {
        console.log('****')
        onChange(format(selectedDate, 'dd.MM.yyyy'))
      }
    }

    return (
      <div className={cn('grid gap-2.5', className)}>
        {label && <FormLabel value={label} required={required} htmlFor="date" />}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left h-9  font-medium text-base rounded-sm shadow-none bg-background',
                !dateValue && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {dateValue ? (
                format(dateValue, 'dd.MM.yyyy')
              ) : (
                <span>Datum auswählen</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleSelect}
              initialFocus
              locale={de}
            />
          </PopoverContent>
        </Popover>
        {help && <p className="text-sm text-gray-500">{help}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)

FormDatePicker.displayName = 'FormDatePicker'
