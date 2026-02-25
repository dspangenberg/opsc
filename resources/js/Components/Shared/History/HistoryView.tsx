/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { type FormDataConvertible, router } from '@inertiajs/core'
import { type FC, Fragment } from 'react'
import type { RouteUrl } from 'ziggy-js'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { parseAndFormatDate } from '@/Lib/DateHelper'
import { HistoryViewItem } from './HistoryViewItem'

interface Props {
  entries: App.Data.NoteableData[]
  route: RouteUrl
}

interface FormData extends Record<string, FormDataConvertible> {
  note: string
}

export const HistoryView: FC<Props> = ({ entries, route: storeRoute }) => {
  const entriesWithDate = entries.map(item => ({
    ...item,
    date: parseAndFormatDate(item.created_at, 'dd. MMMM yyyy')
  }))

  const form = useForm<FormData>(
    'store-note-form',
    'post',
    storeRoute,
    {
      note: ''
    },
    {
      onSuccess: () => {
        form.reset()
        router.reload({ only: ['invoice'] })
      }
    }
  )

  const groupedEntries = Object.groupBy(entriesWithDate, ({ date }) => date)
  const days = Object.keys(groupedEntries)

  const getEntriesByDate = (date: string) => groupedEntries[date] ?? []

  return (
    <div className="mt-8 space-y-4">
      <FormCard
        footer={
          <Button type="submit" form={form.id} variant="default">
            Notiz hinzufügen
          </Button>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-24">
              <FormTextArea autoFocus label="Notiz" {...form.register('note')} />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
      <div className="flex flex-1 flex-col items-start space-y-4">
        {days.map(day => (
          <Fragment key={day}>
            <div className="relative w-full flex-1">
              <div className="absolute inset-x-0 top-1/2 border-border/80 border-t" />
              <div className="relative inline-block bg-page-content pr-2 font-medium text-foreground text-sm">
                {day}
              </div>
            </div>
            <div className="flex w-full flex-col">
              {getEntriesByDate(day).map((item, index) => (
                <HistoryViewItem key={item.id} item={item} />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
