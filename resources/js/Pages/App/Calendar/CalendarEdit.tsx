/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { FormInputColorPicker } from '@/Components/FormInputColorPicker'
import { FormLabel } from '@/Components/FormLabel'
import { InertiaDialog } from '@/Components/InertiaDialog'
import { Button } from '@/Components/ui/button'
import { Icon } from '@/Components/ui/icon'
import { type IconName, IconPicker } from '@/Components/ui/icon-picker'
import { useForm } from '@/Hooks/use-form'
import { useModal } from '@inertiaui/modal-react'
import React, { type FC, type FormEvent, useRef, useState } from 'react'

const CalendarEdit: FC = () => {
  const { close } = useModal()
  const calendar = useModal().props.calendar as App.Data.CalendarData
  const [icon, setIcon] = useState<IconName | null>(calendar.icon as unknown as IconName)

  const dialogRef = useRef<HTMLDivElement>(null)
  const handleClose = () => {
    close()
  }

  const { data, errors, updateAndValidate, updateAndValidateWithoutEvent, submit } = useForm<App.Data.CalendarData>(
    calendar.id ? 'put' : 'post',
    route(calendar.id ? 'app.settings.email.inboxes.update' : 'app.calendar.store', {
      id: calendar.id
    }),
    calendar
  )

  const newCalendarText =
    !calendar.id && calendar.is_default
      ? 'Deinen ersten Kalender hinzufügen'
      : 'Neuen Kalender hinzufügen'

  const title = calendar.id ? 'Kalender bearbeiten' : newCalendarText
  const description = calendar.id
    ? 'Stammdaten des Kalenders bearbeiten'
    : 'Stammdaten für neuen Kalender'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
    } catch (error) {}
  }

  const handleIconChange = (icon: IconName) => {
    updateAndValidateWithoutEvent('icon', icon as unknown as string)
    setIcon(icon)
  }

  const handleColorChange = (color: string) => {
    updateAndValidateWithoutEvent('color', color)
  }

  return (
    <InertiaDialog
      ref={dialogRef}
      title={title}
      onClose={handleClose}
      className="max-w-xl"
      description={description}
      data-inertia-dialog
      dismissible={true}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="CalendarEditForm" type="submit">
            Speichern
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} id="CalendarEditForm">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-16">
            <FormInput
              id="name"
              autoFocus
              label="Bezeichnung"
              required
              value={data.name}
              error={errors?.name || ''}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-2 flex flex-col space-y-2 pt-1">
            <FormLabel>Icon:</FormLabel>
            <IconPicker onSelect={icon => handleIconChange(icon)}>
              <Button variant="outline" size="icon">
                {icon ? (
                  <>
                    <Icon name={icon} className="size-4"/>
                  </>
                ) : (
                  'Pick Icon'
                )}
              </Button>
            </IconPicker>
          </div>
          <div className="col-span-8 md:col-span-6">
            <div className="space-y-2">
              <FormInputColorPicker
                id="color"
                label="Farbe"
                value={calendar.color || ''}
                onChange={handleColorChange}
                error={errors?.color}
              />
            </div>
          </div>
        </FormGroup>
      </form>
    </InertiaDialog>
  )
}

export default CalendarEdit
