/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { FormInputWithCopyToClipboard } from '@/Components/FormInputWithCopyToClipboard'
import { InertiaDialog } from '@/Components/InertiaDialog'
import { Button } from '@/Components/ui/button'
import { useForm } from '@/Hooks/use-form'
import { useModal } from '@inertiaui/modal-react'
import React, { type FormEvent, useRef } from 'react'
import type { FC } from 'react'

const InboxEdit: FC = () => {
  const { close } = useModal()
  const inbox = useModal().props.inbox as App.Data.InboxData

  const dialogRef = useRef<HTMLDivElement>(null)
  const handleClose = () => {
    close()
  }

  const { data, errors, updateAndValidate, submit } =
    useForm<App.Data.InboxData>(
      inbox.id ? 'put' : 'post',
      route(
        inbox.id ? 'app.settings.email.inboxes.update' : 'app.settings.email.inboxes.store',
        { id: inbox.id }
      ),
      inbox
    )

  const title = inbox.id ? 'Inbox bearbeiten' : 'Neue Inbox hinzufügen'

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
      description="Saisons, Zeiträume und Buchungsbeschränkungen werden hier festgelegt."
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
      <form onSubmit={handleSubmit} id="InboxForm">
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
          <div className="col-span-24">
            <FormInputWithCopyToClipboard
              id="name"
              label="Weiterleitungsadresse der Inbox"
              value={data.email_address}
            />
          </div>

        </FormGroup>
      </form>
    </InertiaDialog>
  )
}

export default InboxEdit
