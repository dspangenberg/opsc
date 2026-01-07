import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog } from '@/Components/twc-ui/extended-dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextArea } from '@/Components/twc-ui/form-text-area'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  section: App.Data.OfferSectionData
}

const OfferSectionEdit: React.FC<Props> = ({ section }) => {
  const title = section.id
    ? 'Angebotsbedingungen - Abschnitt bearbeiten'
    : 'Neuen Angebotsbedingungen - Abschnitt hinzufügen'
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.OfferSectionData>(
    'form-offer-section-edit',
    section.id ? 'put' : 'post',
    route(section.id ? 'app.settings.offer-section.update' : 'app.settings.offer-section.store', {
      section: section.id
    }),
    section
  )

  console.log(section)

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.settings.offer-section.index'))
  }

  return (
    <ExtendedDialog
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
            <Button variant="default" form={form.id} type="submit" isLoading={form.processing}>
              Speichern
            </Button>
          </div>
        </div>
      )}
    >
      <Form form={form} onSubmitted={() => setIsOpen(false)}>
        <FormGrid>
          <div className="col-span-24">
            <FormTextField label="Bezeichnung" {...form.register('name')} />
          </div>
          <div className="col-span-24">
            <FormTextField label="Titel im Angebot" {...form.register('title')} />
          </div>
          <div className="col-span-24">
            <FormTextArea label="Standardtext" {...form.register('default_content')} />
            <div className="pt-0.5">
              <FormCheckbox label="Pflichtfeld" {...form.registerCheckbox('is_required')} />
            </div>
          </div>
        </FormGrid>
      </Form>
    </ExtendedDialog>
  )
}

export default OfferSectionEdit
