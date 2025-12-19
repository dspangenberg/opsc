'use client'
import {
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  type DateValue,
  type RangeValue,
  Text
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import {
  CalendarFooter,
  CalendarGridHeader,
  CalendarHeader,
  cellStyles as calendarCellStyles
} from './calendar'

const cellStyles = tv({
  extend: calendarCellStyles,
  variants: {
    isSelected: {
      false: 'hover:bg-accent hover:text-accent-foreground',
      true: [
        'relative rounded-none bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        "after:absolute after:-right-1 after:h-full after:w-1 after:bg-primary after:content-['']"
      ]
    },
    isSelectionStart: {
      true: 'rounded-l-md'
    },
    isSelectionEnd: {
      true: 'rounded-r-md after:content-none'
    }
  }
})

export type FooterButtons = 'reset' | 'today' | 'both' | 'none'

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, 'visibleDuration' | 'onChange'> {
  errorMessage?: string
  className?: string
  footerButtons?: FooterButtons
  maxYears?: number
  onChange?: (value: RangeValue<DateValue> | null) => void
}

export const RangeCalendar = <T extends DateValue>({
  errorMessage,
  className,
  footerButtons = 'both',
  maxYears = 50,
  onChange,
  ...props
}: RangeCalendarProps<T>) => {
  return (
    <AriaRangeCalendar
      className={cn('flex w-fit select-none flex-col bg-card p-3', className)}
      {...props}
    >
      <CalendarHeader maxYears={maxYears} />
      <CalendarGrid className="mt-1 w-full border-collapse" weekdayStyle="short">
        <CalendarGridHeader />
        <CalendarGridBody>
          {date => <CalendarCell date={date} className={cellStyles} />}
        </CalendarGridBody>
      </CalendarGrid>
      <CalendarFooter footerButtons={footerButtons} onChange={onChange} />
      {errorMessage && (
        <Text slot="errorMessage" className="py-2 text-destructive text-sm">
          {errorMessage}
        </Text>
      )}
    </AriaRangeCalendar>
  )
}
