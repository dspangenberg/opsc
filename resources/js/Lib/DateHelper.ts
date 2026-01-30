/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { parseDate as parseDateValue } from '@internationalized/date'
import { format, minutesToHours, parse } from 'date-fns'

export const parseAndFormatDate = (date: string, formatString = 'dd.MM.yyyy') => {
  if (!date) return ''
  let parsedDate: Date
  if (date.length === 10) {
    parsedDate = parse(date, 'dd.MM.yyyy', new Date())
  } else {
    parsedDate = parse(date.substring(0, 16), 'dd.MM.yyyy HH:mm', new Date())
  }

  return format(parsedDate, formatString)
}

export const parseAndFormatDateTime = (date: string, formatString = 'dd.MM.yyyy HH:mm') => {
  if (!date) return ''
  let parsedDate: Date
  parsedDate = parse(date.substring(0, 16), 'yyyy-MM-dd HH:mm', new Date())

  return format(parsedDate, formatString)
}

export const formatDate = (date: Date, formatString = 'dd.MM.yyyy') => {
  return format(date, formatString)
}

export const getNextWeek = (date: string, asString = true) => {
  const parsedDate = parse(date, 'dd.MM.yyyy', new Date())
  parsedDate.setDate(parsedDate.getDate() + 7)
  if (asString) {
    return format(parsedDate, 'dd.MM.yyyy')
  }
  return parsedDate
}

export const getPrevWeek = (date: string) => {
  const parsedDate = parse(date, 'dd.MM.yyyy', new Date())
  parsedDate.setDate(parsedDate.getDate() - 7)
  return format(parsedDate, 'dd.MM.yyyy')
}

export const parseDate = (date: string, formatString = 'dd.MM.yyyy') => {
  let parsedDate: Date
  if (date.length === 10) {
    parsedDate = parse(date, 'dd.MM.yyyy', new Date())
  } else {
    parsedDate = parse(date, 'dd.MM.yyyy HH:mm', new Date())
  }

  return parsedDate
}

// Source: https://github.com/orgs/date-fns/discussions/3285#discussioncomment-4344932
export const minutesToHoursExtended = (minutes: number) => {
  try {
    const hours = minutesToHours(minutes)
    const minutesLeft = minutes - hours * 60
    const stringifiedHours = hours >= 1000
      ? hours.toLocaleString('de-DE')
      : String(hours)
    const stringifiedMinutes =
      String(minutesLeft).length === 1 ? `0${minutesLeft}` : `${minutesLeft}`
    return `${stringifiedHours}:${stringifiedMinutes}`
  } catch (error) {
    console.error('Error converting minutes to hours:', error)
    return '00:00'
  }
}

export const minutesUntilNow = (date: string) => {
  const parsedDate = parse(date, 'dd.MM.yyyy HH:mm', new Date())
  const now = new Date()
  const diff = now.getTime() - parsedDate.getTime()
  return minutesToHoursExtended(Math.floor(diff / 1000 / 60))
}

export const toDateValue = (date: Date) => {
  return parseDateValue(format(date, 'yyyy-MM-dd'))
}
