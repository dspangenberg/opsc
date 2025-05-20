import { JollyDatePicker } from '@/Components/jolly-ui/date-picker'
import type React from 'react'
import { useEffect, useState, type ChangeEvent } from 'react'
import { CalendarDate } from '@internationalized/date'
import { format, parse } from 'date-fns'

interface Props {
  value: string | null
  label?: string
  name: string
  autoFocus?: boolean
  className?: string
  hasError?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const DatePicker: React.FC<Props> = ({
  label,
  value,
  name,
  className = '',
  autoFocus = false,
  hasError = false,
  onChange,
  ...props
}) => {
  const [parsedDate, setParsedDate] = useState<CalendarDate | null>(() => {
    if (value) {
      const date = value ? parse(value, 'dd.MM.yyyy', new Date()) : null
      return date ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) : null
    }
    return null
  })

  const handleDateChange = (date: CalendarDate | null) => {
    const formattedDate = date ? format(date.toDate('Europe/Berlin'), 'dd.MM.yyyy') : null
    console.log('handleDateChange', formattedDate)
    // Erstellen eines synthetischen Event-Objekts
    const syntheticEvent = {
      target: {
        name,
        value: formattedDate,
        type: 'date',
        checked: false,
        // Fügen Sie hier weitere Eigenschaften hinzu, die möglicherweise benötigt werden
      },
      currentTarget: {
        name,
        value: formattedDate,
        type: 'date',
        checked: false,
        // Fügen Sie hier weitere Eigenschaften hinzu, die möglicherweise benötigt werden
      },
      nativeEvent: new Event('change'),
      bubbles: true,
      cancelable: false,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      preventDefault: () => {},
      isDefaultPrevented: () => false,
      stopPropagation: () => {},
      isPropagationStopped: () => false,
      persist: () => {},
      timeStamp: Date.now(),
      type: 'change',
    } as unknown as ChangeEvent<HTMLInputElement>

    onChange(syntheticEvent)
  }

  useEffect(() => {
    if (value) {
      const date = parse(value, 'dd.MM.yyyy', new Date())
      setParsedDate(new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()))
    } else {
      setParsedDate(null)
    }
  }, [value])

  return (
    <JollyDatePicker
      autoFocus
      label={label}
      isInvalid={hasError}
      value={parsedDate}
      className={className}
      onChange={handleDateChange}
      {...props}
    />
  )
}
