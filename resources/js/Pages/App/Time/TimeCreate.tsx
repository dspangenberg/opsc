import { Button } from '@/Components/ui/twc-ui/button'
import { Checkbox } from '@/Components/ui/twc-ui/checkbox'
import { ComboBox } from '@/Components/ui/twc-ui/combo-box'
import { DateTimeField } from '@/Components/ui/twc-ui/date-time-field'
import { Dialog } from '@/Components/ui/twc-ui/dialog'
import { Form, useForm } from '@/Components/ui/twc-ui/form'
import { FormGroup } from '@/Components/ui/twc-ui/form-group'
import { Select } from '@/Components/ui/twc-ui/select'
import { TextField } from '@/Components/ui/twc-ui/text-field'
import { formatDate } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'
import { Clock05Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'

interface Props extends PageProps {
  time: App.Data.TimeData
  projects: App.Data.ProjectData[]
  categories: App.Data.TimeCategoryData[]
  users: App.Data.UserData[]
}

const TimeCreate: React.FC<Props> = ({ time, projects, categories, users }) => {
  const title = time.id ? 'Zeit bearbeiten' : 'Neue Zeit hinzufügen'
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.TimeData>(
    'form-contact-edit-address',
    time.id ? 'put' : 'post',
    route(time.id ? 'app.time.update' : 'app.time.store', {
      id: time.id
    }),
    time
  )

  const handleClose = () => {
    setIsOpen(false)
    if (route().queryParams.view === 'week') {
      router.visit(route('app.time.my-week'))
    }

    router.visit(route('app.time.index'))
  }

  const handleClockClicked = (field: keyof App.Data.TimeData) => {
    const now = formatDate(new Date(), 'dd.MM.yyyy HH:mm')
    form.updateAndValidateWithoutEvent(field, now)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClosed={handleClose}
      title={title}
      confirmClose={form.isDirty}
      footer={dialogRenderProps => (
        <div className="mx-0 flex w-full gap-2">
          <div className="flex flex-1 justify-start" />
          <div className="flex flex-none gap-2">
            <Button variant="outline" onClick={dialogRenderProps.close}>
              Abbrechen
            </Button>
            <Button variant="default" form={form.id} type="submit">
              Speichern
            </Button>
          </div>
        </div>
      )}
    >
      <Form form={form} onSubmitted={handleClose}>
        <FormGroup>
          <div className="col-span-10 flex items-end gap-2">
            <DateTimeField autoFocus label="Start" {...form.register('begin_at')} />
            <Button
              icon={Clock05Icon}
              variant="ghost"
              size="icon"
              onClick={() => handleClockClicked('begin_at')}
              tooltip="Aktuelle Uhrzeit übernehmen"
            />
          </div>
          <div className="col-span-10 flex items-end gap-2">
            <DateTimeField label="Ende" {...form.register('end_at')} />
            <Button
              icon={Clock05Icon}
              variant="ghost"
              size="icon"
              onClick={() => handleClockClicked('end_at')}
              tooltip="Aktuelle Uhrzeit übernehmen"
            />
          </div>
          <div className="col-span-24">
            <TextField label="Notizen" textArea rows={2} {...form.register('note')} />
            <div className="flex gap-4 pt-0.5">
              <Checkbox {...form.registerCheckbox('is_billable')} className="pt-1.5">
                abrechenbar
              </Checkbox>
              <Checkbox {...form.registerCheckbox('is_locked')} className="pt-1.5">
                gesperrt
              </Checkbox>
            </div>
          </div>

          <div className="col-span-24">
            <ComboBox<App.Data.ProjectData>
              {...form.register('project_id')}
              label="Projekt"
              items={projects}
            />
          </div>
          <div className="col-span-12">
            <Select<App.Data.TimeCategoryData>
              {...form.register('time_category_id')}
              label="Kategorie"
              items={categories}
            />
          </div>
          <div className="col-span-12">
            <Select<App.Data.UserData>
              {...form.register('user_id')}
              label="Mitarbeiter"
              itemName="full_name"
              items={users}
            />
          </div>
        </FormGroup>
      </Form>
    </Dialog>
  )
}

export default TimeCreate
