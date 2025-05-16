import { Button, FormLabel } from '@dspangenberg/twcui'
import { Calendar } from '@/Components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover'
import { cn } from '@/Lib/utils'
import { format, parse } from 'date-fns'
import { de } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { forwardRef } from 'react'
import type { DateRange } from 'react-day-picker'

interface FormDateRangePicker {
  from: string
  to: string
  onChange: (range: { from: string; to: string }) => void
  error?: string
  className?: string
  label?: string
  help?: string
  required?: boolean
}

export const FormDateRangePicker = forwardRef<HTMLButtonElement, FormDateRangePicker>(
  ({ required = false, className = '', help = '', label, error = '', from, to, onChange }, ref) => {
    const beginOn = from ? parse(from, 'dd.MM.yyyy', new Date()) : undefined
    const endOn = to ? parse(to, 'dd.MM.yyyy', new Date()) : undefined

    const [date, setDate] = React.useState<DateRange | undefined>({
      from: beginOn,
      to: endOn
    })

    const handleSelect = (selectedDate: DateRange | undefined) => {
      setDate(selectedDate)
      console.log('Date selected:', selectedDate)

      if (selectedDate === undefined) {
        onChange({
          from: '',
          to: ''
        })
      }

      if (selectedDate) {
        const beginOn = selectedDate.from ? format(selectedDate.from as Date, 'dd.MM.yyyy') : ''
        const endOn = selectedDate.to ? format(selectedDate.to as Date, 'dd.MM.yyyy') : ''
        onChange({
          from: beginOn,
          to: endOn
        })
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
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'dd.MM.yyyy')} - {format(date.to, 'dd.MM.yyyy')}
                  </>
                ) : (
                  format(date.from, 'dd.MM.yyyy')
                )
              ) : (
                <span>Zeitraum auswählen</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
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

FormDateRangePicker.displayName = 'FormDateRangePicker'
