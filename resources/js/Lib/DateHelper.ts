/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { format, minutesToHours, parse } from 'date-fns'

export const parseAndFormatDate = (date: string, formatString = 'dd.MM.yyyy') => {
  let parsedDate: Date
  if (date.length === 10) {
    parsedDate = parse(date, 'dd.MM.yyyy', new Date())
  } else {
    parsedDate = parse(date, 'dd.MM.yyyy HH:mm', new Date())
  }

  return format(parsedDate, formatString)
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
  const hours = minutesToHours(minutes)
  const minutesLeft = minutes - hours * 60
  const stringifiedHours = String(hours).length === 1 ? `${hours}` : `${hours}`
  const stringifiedMinutes = String(minutesLeft).length === 1 ? `0${minutesLeft}` : `${minutesLeft}`
  return `${stringifiedHours}:${stringifiedMinutes}`
}
