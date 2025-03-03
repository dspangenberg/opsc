import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { format, getDaysInMonth, isWithinInterval, parse } from 'date-fns'
import type { Locale } from 'date-fns'
import { de, enUS } from 'date-fns/locale'
import React, { useMemo, useCallback } from 'react'

interface SeasonCalendarProps {
  seasons: App.Data.SeasonData[]
  year: number
  locale?: string
}

interface MonthData {
  id: number
  label: string
  days: number
}


const localeMap: { [key: string]: Locale } = {
  de: de,
  en: enUS,
}

export const SeasonCalendar: React.FC<SeasonCalendarProps> = ({ seasons, year, locale = 'de' }) => {
  const dateLocale = localeMap[locale] || de // Default to English if the locale is not found

  const months: MonthData[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const date = new Date(year, index, 1)
      return {
        id: index,
        label: format(date, 'MMMM', { locale: dateLocale }),
        days: getDaysInMonth(date)
      }
    })
  }, [year, locale])



  const defaultSeason = useMemo(() => seasons.find(season => season.is_default), [seasons])

  const getSeason = useCallback((date: Date) => {
    for (const season of seasons) {
      if (season?.periods && season.periods.length > 0) {
        for (const period of season.periods) {
          const start = parse(period.begin_on, 'dd.MM.yyyy', new Date())
          const end = parse(period.end_on, 'dd.MM.yyyy', new Date())
          if (isWithinInterval(date, { start, end })) {
            return { currentPeriod: `${period.begin_on} - ${period.end_on}`, ...season }
          }
        }
      }
    }
    return defaultSeason ? { currentPeriod: '', ...defaultSeason } : null
  }, [seasons, defaultSeason])

  const getBackgroundColor = useCallback((month: MonthData, day: number) => {
    if (day > month.days) return '#000'
    const season = getSeason(new Date(year, month.id, day))
    return season?.color ?? '#000000'
  }, [getSeason, year])

  const getIdealTextColor = useCallback((bgColor: string): string => {
    const hex = bgColor.replace('#', '')
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 125 ? '#000000' : '#FFFFFF'
  }, [])

  const renderDay = useCallback((month: MonthData, day: number) => {
    const date = new Date(year, month.id, day)
    const season = getSeason(date)
    const bgColor = getBackgroundColor(month, day)
    const textColor = getIdealTextColor(season?.color as string)

    return (
      <div
        key={`${month.id}-${day}`}
        className="size-6 border border-white hover:border-black text-center text-white text-xxs flex items-center justify-center"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="text-center">
              {[1, 7, 14, 21, 28].includes(day) ? day : '\u00A0'}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="pb-1 font-bold">{format(date, 'EEEE dd.MM.yyyy', {locale: de})}</div>
            {season?.name}<br/>
            {season?.currentPeriod}
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }, [year, getSeason, getBackgroundColor, getIdealTextColor])

  return (
    <div className="flex-1 w-full flex flex-wrap border p-0.5">
      {months.map(month => (
        <React.Fragment key={month.label}>
          <div
            className="size-6 border border-white text-center text-black text-xxs flex items-center justify-center"
            style={{ backgroundColor: '#eee' }}
          >
            <Tooltip>
              <TooltipTrigger>{month.label.substring(0, 3)}</TooltipTrigger>
              <TooltipContent>
                {month.label} {year}
              </TooltipContent>
            </Tooltip>
          </div>
          {Array.from({ length: month.days }, (_, i) => renderDay(month, i + 1))}
        </React.Fragment>
      ))}
    </div>
  )
}
