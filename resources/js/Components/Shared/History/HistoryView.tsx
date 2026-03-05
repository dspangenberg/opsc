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
import { HistoryViewItem } from './HistoryViewItem'

interface Props {
  entries: App.Data.NoteableData[]
  route: RouteUrl
}

interface FormData extends Record<string, FormDataConvertible> {
  note: string
}

export const HistoryView: FC<Props> = ({ entries, route: storeRoute }) => {
  const form = useForm<FormData>('store-note-form', 'post', storeRoute, {
    note: ''
  })

  const handleFormSubmit = () => {
    form.reset()
    router.reload({ only: ['invoice'] })
  }

  return (
    <div className="mt-8 space-y-4">
      <FormCard
        footer={
          <Button
            type="submit"
            form={form.id}
            variant="default"
            title="Notiz hinzufügen"
            isDisabled={!form.data.note}
            isLoading={form.processing}
          />
        }
      >
        <Form form={form} onSubmitted={handleFormSubmit}>
          <FormGrid>
            <div className="col-span-24">
              <FormTextArea
                autoFocus
                aria-label="Notiz schreiben"
                placeholder="Neue Notiz erstellen"
                {...form.register('note')}
              />
            </div>
          </FormGrid>
        </Form>
      </FormCard>
      <div className="mt-6 flex flex-1 flex-col items-start">
        <div className="flex w-full flex-col">
          {entries.map((item, index) => (
            <Fragment key={item.id}>
              <HistoryViewItem key={item.id} item={item} />
              {index !== entries.length - 1 && (
                <div className="relative h-fit min-h-3 w-12">
                  <div className="absolute inset-y-0 left-1/2 border-gray-300 border-l" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
