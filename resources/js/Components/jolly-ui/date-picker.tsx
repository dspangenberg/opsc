import {
  composeRenderProps,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DatePickerStateContext,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  DateRangePickerStateContext,
  type DateValue as AriaDateValue,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  type PopoverProps as AriaPopoverProps,
  Text,
  type ValidationResult as AriaValidationResult
} from 'react-aria-components'
import { Calendar04Icon, MultiplicationSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '@/Lib/utils'
import { FieldGroup } from '@/Components/jolly-ui/field'
import { Popover } from '@/Components/jolly-ui/popover'

import { Button } from './button'
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  RangeCalendar
} from './calendar'
import { DateInput } from './datefield'
import { FieldError, Label } from './field'
import React from 'react'

const DatePicker = AriaDatePicker

const DateRangePicker = AriaDateRangePicker

const DatePickerContent = ({
  className,
  popoverClassName,
  ...props
}: AriaDialogProps & { popoverClassName?: AriaPopoverProps['className'] }) => (
  <Popover
    className={composeRenderProps(popoverClassName, className => cn('w-auto p-3', className))}
  >
    <AriaDialog
      className={cn(
        'flex w-full flex-col space-y-4 outline-none sm:flex-row sm:space-x-4 sm:space-y-0 pointer-events-auto z-[100]',
        className
      )}
      {...props}
    />
  </Popover>
)

const DatePickerClearButton = () => {
  const state = React.useContext(DatePickerStateContext)
  if (!state || !state.value) return null
  return (
    <Button
      slot={null}
      variant="ghost"
      aria-label="Clear"
      size="icon"
      className="mx-1 size-5 data-[focus-visible]:ring-offset-0"
      onPress={() => state.setValue(null)}
    >
      <HugeiconsIcon icon={MultiplicationSignIcon} className="size-4" />
    </Button>
  )
}

const DateRangePickerClearButton = () => {
  const state = React.useContext(DateRangePickerStateContext)
  
  if (!state || !state.value) return null
  return (
    <Button
      slot={null}
      variant="ghost"
      aria-label="Clear"
      size="icon"
      className="mx-1 size-5 data-[focus-visible]:ring-offset-0"
      onPress={() => state.setValue(null)}
    >
      <HugeiconsIcon icon={MultiplicationSignIcon} className="size-4" />
    </Button>
  )
}
interface JollyDatePickerProps<T extends AriaDateValue> extends AriaDatePickerProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function JollyDatePicker<T extends AriaDateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: JollyDatePickerProps<T>) {
  return (
    <DatePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      {...props}
    >
      <Label>{label}:</Label>
      <FieldGroup>
        <DateInput className="flex-1" variant="ghost" />
        <DatePickerClearButton />
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <HugeiconsIcon icon={Calendar04Icon} className="size-4" />
        </Button>
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <Calendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {day => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>{date => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </DatePickerContent>
    </DatePicker>
  )
}

interface JollyDateRangePickerProps<T extends AriaDateValue> extends AriaDateRangePickerProps<T> {
  label?: string
  description?: string
  errorMessage?: string | ((validation: AriaValidationResult) => string)
}

function JollyDateRangePicker<T extends AriaDateValue>({
  label,
  description,
  errorMessage,
  className,
  ...props
}: JollyDateRangePickerProps<T>) {
  return (
    <DateRangePicker
      className={composeRenderProps(className, className =>
        cn('group flex flex-col gap-1.5', className)
      )}
      {...props}
    >
      <Label>{label}:</Label>
      <FieldGroup>
        <DateInput variant="ghost" slot={'start'} />
        <span aria-hidden className="px-2 text-sm text-muted-foreground">
          -
        </span>
        <DateInput className="flex-1" variant="ghost" slot={'end'} />

        <Button
          variant="ghost"
          size="icon"
          className="mr-1 size-6 data-[focus-visible]:ring-offset-0"
        >
          <HugeiconsIcon icon={Calendar04Icon} className="size-4" />
        </Button>
        <DateRangePickerClearButton />
      </FieldGroup>
      {description && (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <DatePickerContent>
        <RangeCalendar>
          <CalendarHeading />
          <CalendarGrid>
            <CalendarGridHeader>
              {day => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>{date => <CalendarCell date={date} />}</CalendarGridBody>
          </CalendarGrid>
        </RangeCalendar>
      </DatePickerContent>
    </DateRangePicker>
  )
}

export { DatePicker, DatePickerContent, DateRangePicker, JollyDatePicker, JollyDateRangePicker }
export type { JollyDatePickerProps, JollyDateRangePickerProps }
