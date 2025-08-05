import { Button } from '@/Components/ui/twc-ui/button'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import type { PageProps } from '@/Types'
import { router } from '@inertiajs/react'
import type * as React from 'react'

interface Props extends PageProps {
  time: App.Data.TimeData
  projects: App.Data.ProjectData[]
  categories: App.Data.TimeCategoryData[]
  users: App.Data.UserData[]
}

const TimeCreate: React.FC<Props> = ({ time, projects, categories, users }) => {
  const title = time.id ? 'Anschrift bearbeiten' : 'Neue Anschrift hinzufügen'

  const form = useForm<App.Data.TimeData>(
    'form-contact-edit-address',
    time.id ? 'put' : 'post',
    route(time.id ? 'app.time.update' : 'app.time.store', {
      time
    }),
    time
  )

  const handleClose = () => {
    console.log('close')

    if (route().queryParams.view === 'week') {
      router.visit(route('app.time.my-week'))
    }

    router.visit(route('app.time.index'))
  }

  return (
    <Dialog
      isOpen={true}
      onClosed={handleClose}
      confirmClose={form.isDirty}
      footer={dialogRenderProps => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={dialogRenderProps.close}>
            Abbrechen
          </Button>
          <Button variant="default" form={form.id} type="submit">
            Speichern
          </Button>
        </div>
      )}
    >
      <Form form={form}>
        <FormGroup>
          <div className="col-span-24">
            <Select<App.Data.ProjectData>
              autoFocus
              {...form.register('project_id')}
              label="Projekt"
              items={projects}
            />
          </div>
          <div className="col-span-24">
            <TextField label="Beschreibung" textArea rows={2} {...form.register('note')} />
          </div>
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default TimeCreate
