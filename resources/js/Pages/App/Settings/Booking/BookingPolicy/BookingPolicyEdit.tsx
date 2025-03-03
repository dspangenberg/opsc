/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { FormNumberInput } from '@/Components/FormNumberInput'
import { InertiaDialog } from '@/Components/InertiaDialog'
import { Button } from '@/Components/ui/button'
import { useForm } from '@/Hooks/use-form'
import { useModal } from '@inertiaui/modal-react'
import React, { type FormEvent, useRef } from 'react'
import type { FC } from 'react'

const BookingPolicyEdit: FC = () => {
  const { close } = useModal()
  const policy = useModal().props.policy as App.Data.InboxData

  const dialogRef = useRef<HTMLDivElement>(null)
  const handleClose = () => {
    close()
  }

  const { data, errors, updateAndValidate, submit } =
    useForm<App.Data.InboxData>(
      policy.id ? 'put' : 'post',
      route(
        policy.id ? 'app.settings.email.inboxes.update' : 'app.settings.email.inboxes.store',
        { id: policy.id }
      ),
      policy
    )

  const title = policy.id ? 'Buchungsrichtlinie bearbeiten' : 'Neue Buchungsrichtlinie hinzufügen'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await submit(event)
    } catch (error) {}
  }

  return (
    <InertiaDialog
      ref={dialogRef}
      title={title}
      onClose={handleClose}
      className="max-w-xl"
      description={title}
      data-inertia-dialog
      dismissible={true}
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="InboxForm" type="submit">
            Speichern
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} id="BoolingPolicyForm">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-24">
            <FormInput
              id="name"
              autoFocus
              label="Bezeichnung"
              value={data.name}
              error={errors?.name || ''}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-8">
            <FormNumberInput label="Mindesaufenthalt" value={1} />
          </div>
        </FormGroup>
      </form>
    </InertiaDialog>
  )
}

export default BookingPolicyEdit
