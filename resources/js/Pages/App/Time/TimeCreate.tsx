import { Clock05Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDateTimeField } from '@/Components/twc-ui/form-date-time-field'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormSelect } from '@/Components/twc-ui/form-select'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { formatDate } from '@/Lib/DateHelper'
import type { PageProps } from '@/Types'

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
      id: time.id,
      _query: {
        view: route().queryParams.view
      }
    }),
    time
  )

  const handleClose = () => {
    setIsOpen(false)
    if (route().queryParams.view === 'my-week') {
      router.visit(
        route('app.time.my-week', {
          _query: {
            view: 'my-week'
          }
        })
      )
    } else {
      router.visit(route('app.time.index'))
    }
  }

  const handleSubmit = () => {
    setIsOpen(false)
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
      <Form form={form} onSubmitted={handleSubmit}>
        <FormGrid>
          <div className="col-span-10 flex items-end gap-2">
            <FormDateTimeField autoFocus label="Start" {...form.register('begin_at')} />
            <Button
              icon={Clock05Icon}
              variant="ghost"
              size="icon"
              onClick={() => handleClockClicked('begin_at')}
              tooltip="Aktuelle Uhrzeit übernehmen"
            />
          </div>
          <div className="col-span-10 flex items-end gap-2">
            <FormDateTimeField label="Ende" {...form.register('end_at')} />
            <Button
              icon={Clock05Icon}
              variant="ghost"
              size="icon"
              onClick={() => handleClockClicked('end_at')}
              tooltip="Aktuelle Uhrzeit übernehmen"
            />
          </div>
          <div className="col-span-24">
            <FormTextArea label="Notizen" rows={2} {...form.register('note')} />
            <div className="flex gap-4 pt-0.5">
              <Checkbox {...form.registerCheckbox('is_billable')} className="pt-1.5">
                abrechenbar
              </Checkbox>
              <Checkbox
                {...form.registerCheckbox('is_locked')}
                className="pt-1.5"
                isDisabled={!form.data.is_billable}
              >
                gesperrt
              </Checkbox>
            </div>
          </div>

          <div className="col-span-24">
            <FormComboBox<App.Data.ProjectData>
              {...form.register('project_id')}
              label="Projekt"
              items={projects}
            />
          </div>
          <div className="col-span-12">
            <FormSelect<App.Data.TimeCategoryData>
              {...form.register('time_category_id')}
              label="Kategorie"
              items={categories}
            />
          </div>
          <div className="col-span-12">
            <FormSelect<App.Data.UserData>
              {...form.register('user_id')}
              label="Mitarbeiter"
              itemName="full_name"
              items={users}
            />
          </div>
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default TimeCreate
