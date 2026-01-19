import { type CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { ChevronLeft, ChevronRight, Dot } from 'lucide-react'
import type React from 'react'
import { use } from 'react'
import { useDateFormatter } from 'react-aria'
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  type CalendarState,
  CalendarStateContext,
  type DateValue,
  type RangeCalendarState,
  RangeCalendarStateContext,
  type RangeValue,
  Text,
  useLocale
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { cn } from '@/Lib/utils'
import { Button } from './button'
import { Select } from './select'

export const cellStyles = tv({
  base: 'relative mt-1 flex size-8 cursor-default items-center justify-center rounded-md p-0 font-normal text-sm transition-[box-shadow] forced-color-adjust-none',
  variants: {
    isSelected: {
      false: 'hover:bg-accent hover:text-accent-foreground',
      true: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
    },
    isDisabled: {
      true: 'text-muted-foreground opacity-50'
    },
    isOutsideMonth: {
      true: 'text-muted-foreground opacity-70'
    },
    isPressed: {
      true: 'border-ring ring-[3px] ring-ring/50'
    },
    isUnavailable: {
      true: 'text-muted-foreground opacity-50'
    },
    isToday: {
      true: 'after:pointer-events-none after:absolute after:start-1/2 after:bottom-1 after:z-10 after:size-[4px] after:-translate-x-1/2 after:rounded-full after:bg-primary selected:after:bg-primary-fg focus-visible:after:bg-primary-fg'
    }
  }
})

export type FooterButtons = 'reset' | 'today' | 'both' | 'none'

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, 'visibleDuration'> {
  errorMessage?: string
  className?: string
  maxYears?: number
  footerButtons?: FooterButtons
  onChange?: (value: DateValue | null) => void
}

export const Calendar = <T extends DateValue>({
  errorMessage,
  className,
  maxYears = 50,
  footerButtons = 'both',
  onChange,
  ...props
}: CalendarProps<T>) => {
  return (
    <AriaCalendar
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
      {errorMessage && (
        <Text slot="errorMessage" className="py-2 text-destructive text-sm">
          {errorMessage}
        </Text>
      )}
      <CalendarFooter onChange={onChange} footerButtons={footerButtons} />
    </AriaCalendar>
  )
}

const CalendarHeader = ({
  isRange,
  className,
  maxYears = 50,
  onChange,
  ...props
}: React.ComponentProps<'header'> & {
  isRange?: boolean
  maxYears?: number
  onChange?: (value: DateValue | null) => void
}) => {
  const { direction, locale } = useLocale()
  const calendarState = use(CalendarStateContext)
  const rangeCalendarState = use(RangeCalendarStateContext)
  const state = calendarState || rangeCalendarState

  if (!state) return null
  const minYear = state.minValue?.year ?? today(getLocalTimeZone()).year - maxYears
  const maxYear = state.maxValue?.year ?? today(getLocalTimeZone()).year + maxYears

  const todayButtonText = locale.startsWith('de') ? 'Zu heute blättern' : 'Navigate to today'

  const currentDate = state.focusedDate
  const currentYear = currentDate.year
  const currentMonth = currentDate.month

  const isAtMin =
    minYear !== undefined &&
    (currentYear < minYear || (currentYear === minYear && currentMonth === 1))

  const isAtMax =
    maxYear !== undefined &&
    (currentYear > maxYear || (currentYear === maxYear && currentMonth === 12))

  return (
    <header
      data-slot="calendar-header"
      className={cn('flex w-full justify-between gap-1 pt-1 pr-1 pb-5 pl-1.5 sm:pb-4', className)}
      {...props}
    >
      <div className="flex items-center gap-1">
        <SelectMonth state={state} />
        <SelectYear state={state} minYear={minYear} maxYear={maxYear} />
      </div>

      <div className="flex items-center">
        <Button variant="ghost" size="icon-xs" slot="previous" isDisabled={isAtMin}>
          {direction === 'rtl' ? (
            <ChevronRight aria-hidden className="size-4" />
          ) : (
            <ChevronLeft aria-hidden className="size-4" />
          )}
        </Button>
        <Button
          icon={Dot}
          variant="ghost"
          size="icon-xs"
          slot={null}
          iconClassName="text-primary size-8"
          tooltip={todayButtonText}
          onClick={() => state?.setFocusedDate(today(getLocalTimeZone()))}
        />
        <Button variant="ghost" size="icon-xs" slot="next" isDisabled={isAtMax}>
          {direction === 'rtl' ? (
            <ChevronLeft aria-hidden className="size-4" />
          ) : (
            <ChevronRight aria-hidden className="size-4" />
          )}
        </Button>
      </div>
    </header>
  )
}

const CalendarFooter = ({
  footerButtons = 'both',
  onChange
}: {
  footerButtons?: FooterButtons
  onChange?: ((value: DateValue | null) => void) | ((value: RangeValue<DateValue> | null) => void)
}) => {
  const calendarState = use(CalendarStateContext)
  const rangeCalendarState = use(RangeCalendarStateContext)
  const state = calendarState || rangeCalendarState
  const { locale } = useLocale()
  if (!state) return null

  const todayButtonText = locale.startsWith('de') ? 'Heute' : 'Today'
  const resetButtonText = locale.startsWith('de') ? 'Zurücksetzen' : 'Clear'

  if (footerButtons === 'none') return null
  return (
    <footer className="flex items-center justify-between gap-2 px-3 pt-3">
      {['today', 'both'].includes(footerButtons) && (
        <Button
          variant="ghost"
          size="full"
          title={todayButtonText}
          onClick={() => {
            const todayDate = today(getLocalTimeZone())
            if (rangeCalendarState) {
              rangeCalendarState.setValue({ start: todayDate, end: todayDate })
              ;(onChange as ((value: RangeValue<DateValue> | null) => void) | undefined)?.({
                start: todayDate,
                end: todayDate
              })
            } else if (calendarState) {
              ;(calendarState as CalendarState).setValue(todayDate)
              ;(onChange as ((value: DateValue | null) => void) | undefined)?.(todayDate)
            }
            state.setFocusedDate(todayDate)
          }}
          slot={null}
        />
      )}
      {['reset', 'both'].includes(footerButtons) && (
        <Button
          variant="ghost-destructive"
          size="full"
          title={resetButtonText}
          onClick={() => {
            state.setValue(null)
            onChange?.(null)
          }}
          slot={null}
        />
      )}
    </footer>
  )
}

export const CalendarGridHeader = () => {
  return (
    <AriaCalendarGridHeader>
      {day => (
        <CalendarHeaderCell className="text-center font-medium text-foreground text-sm">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  )
}

const SelectMonth = ({ state }: { state: CalendarState | RangeCalendarState }) => {
  const months: { id: string; name: string }[] = []

  const formatter = useDateFormatter({
    month: 'long',
    timeZone: state.timeZone
  })

  const numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate)
  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i })
    months.push({
      id: i.toString(),
      name: formatter.format(date.toDate(state.timeZone))
    })
  }
  return (
    <Select
      aria-label="Select month"
      className="w-20"
      value={state.focusedDate.month.toString() ?? (new Date().getMonth() + 1).toString()}
      items={months}
      onChange={value => {
        state.setFocusedDate(state.focusedDate.set({ month: Number(value) }))
      }}
    />
  )
}

const SelectYear = ({
  minYear,
  maxYear,
  state
}: {
  state: CalendarState | RangeCalendarState
  minYear: number
  maxYear: number
}) => {
  const years: { id: number; name: string; date: CalendarDate }[] = []
  const formatter = useDateFormatter({
    year: 'numeric',
    timeZone: state.timeZone
  })

  for (let i = minYear; i <= maxYear; i++) {
    const date = state.focusedDate.set({ year: i })
    years.push({
      id: i,
      name: formatter.format(date.toDate(state.timeZone)),
      date: date
    })
  }

  return (
    <Select
      aria-label="Select year"
      className="w-20"
      value={state.focusedDate.year}
      items={years}
      onChange={value => {
        const selectedYear = years.find(y => y.id === Number(value))
        if (selectedYear) {
          state.setFocusedDate(selectedYear.date)
        }
      }}
    />
  )
}

export {
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  CalendarFooter,
  CalendarHeader
}
