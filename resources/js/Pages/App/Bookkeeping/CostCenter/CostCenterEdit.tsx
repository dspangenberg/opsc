import { router } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { FormComboBox } from '@/Components/twc-ui/combo-box'
import { Dialog } from '@/Components/twc-ui/dialog'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { TextField } from '@/Components/twc-ui/text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  cost_center: App.Data.CostCenterData
  bookkeeping_accounts: App.Data.BookkeepingAccountData[]
}

const CostCenterEdit: React.FC<Props> = ({ cost_center, bookkeeping_accounts }) => {
  const title = cost_center.id ? 'Kostenstelle bearbeiten' : 'Neue Kostenstelle hinzufügen'
  const [isOpen, setIsOpen] = useState(true)

  const form = useForm<App.Data.CostCenterData>(
    'form-contact-edit-address',
    cost_center.id ? 'put' : 'post',
    route(
      cost_center.id ? 'app.bookkeeping.cost-centers.update' : 'app.bookkeeping.cost-centers.store',
      {
        id: cost_center.id
      }
    ),
    cost_center
  )

  const handleClose = () => {
    setIsOpen(false)
    router.visit(route('app.bookkeeping.cost-centers.index'))
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
            <TextField label="Bezeichnung" {...form.register('name')} />
          </div>

          <div className="col-span-24">
            <FormComboBox<App.Data.BookkeepingAccountData>
              {...form.register('bookkeeping_account_id')}
              label="Buchhalterkonto"
              itemName="label"
              items={bookkeeping_accounts}
            />
          </div>
        </FormGrid>
      </Form>
    </Dialog>
  )
}

export default CostCenterEdit
