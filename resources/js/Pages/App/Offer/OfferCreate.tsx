import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormDatePicker } from '@/Components/twc-ui/form-date-picker'
import { FormDateRangePicker } from '@/Components/twc-ui/form-date-range-picker'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormRadioGroup } from '@/Components/twc-ui/form-radio-group'
import { FormSelect } from '@/Components/twc-ui/form-select'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  offer: App.Data.OfferData
  projects: App.Data.ProjectData[]
  taxes: App.Data.TaxData[]
  contacts: App.Data.ContactData[]
}

const OfferCreate: React.FC<Props> = ({ offer, contacts, projects, taxes }) => {
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.OfferData>(
    'form-offer-create',
    'post',
    route('app.offer.store'),
    offer
  )

  const handleClose = () => {
    router.visit(route('app.offer.index'))
  }

  const handleSubmit = () => {
    setIsOpen(false)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClosed={handleClose}
      title="Angebot erstellen"
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
          <div className="col-span-24">
            <FormComboBox<App.Data.ContactData>
              label="Kunde"
              {...form.register('contact_id')}
              autoFocus
              itemName="reverse_full_name"
              items={contacts}
            />
          </div>
        </FormGrid>
        <FormGrid>
          <div className="col-span-8">
            <FormDatePicker label="Angebotsdatum" {...form.register('issued_on')} />
          </div>
          <div className="col-span-16" />
        </FormGrid>
        <FormGrid>
          <div className="col-span-12">
            <FormSelect<App.Data.TaxData>
              {...form.register('tax_id')}
              label="Umsatzsteuer"
              items={taxes}
            />
          </div>
          <div className="col-span-12">
            <FormSelect<App.Data.ProjectData>
              label="Projekt"
              {...form.register('project_id')}
              isOptional
              optionalValue="(kein Projekt)"
              items={projects}
            />
          </div>
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default OfferCreate
