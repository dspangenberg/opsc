import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useMemo } from 'react'
import { PageContainer } from '@/Components/PageContainer'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCard } from '@/Components/twc-ui/form-card'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { FormTextField } from '@/Components/twc-ui/form-text-field'
import type { PageProps } from '@/Types'

interface Props extends PageProps {
  bank_account: App.Data.BankAccountData
  bookkeeping_accounts: App.Data.BookkeepingAccountData[]
}

const BankAccountEdit: React.FC<Props> = ({ bank_account, bookkeeping_accounts }) => {
  const { auth } = usePage().props

  const title = bank_account.id ? 'Bankkonto bearbeiten' : 'Neues Bankkonto hinzufügen'

  const form = useForm<App.Data.BankAccountData>(
    'form-bank-account.-edit',
    bank_account.id ? 'put' : 'post',
    route(
      bank_account.id
        ? 'app.bookkeeping.bank-account.update'
        : 'app.bookkeeping.bank-account.store',
      {
        bank_account: bank_account.id
      }
    ),
    bank_account
  )

  const handleCancel = () => {
    router.visit(route('app.bookkeeping.bank-account.index'))
  }

  const cancelButtonTitle = form.isDirty ? 'Abbrechen' : 'Zurück'
  const breadcrumbs = useMemo(
    () => [{ title: 'Einstellungen' }, { title: 'Buchhaltung' }, { title: 'Bankkonten' }],
    []
  )

  return (
    <PageContainer
      title={title}
      width="4xl"
      className="flex overflow-hidden"
      breadcrumbs={breadcrumbs}
    >
      <FormCard
        className="flex flex-1 overflow-y-hidden"
        innerClassName="bg-background"
        footer={
          <div className="flex flex-none items-center justify-end gap-2">
            <Button variant="outline" onClick={handleCancel} title={cancelButtonTitle} />
            <Button variant="default" form={form.id} type="submit" title="Speichern" />
          </div>
        }
      >
        <Form form={form}>
          <FormGrid>
            <div className="col-span-13">
              <FormTextField label="Bezeichnung" autoFocus {...form.register('name')} />
              <div className="mt-2 flex gap-2">
                <FormCheckbox label="Paypal-Konto" {...form.registerCheckbox('is_paypal')} />
                <FormCheckbox
                  label="Konto ist geschlossen"
                  isDisabled={form.data.is_default}
                  {...form.registerCheckbox('is_closed')}
                />
              </div>
            </div>

            <div className="col-span-11">
              <FormTextField label="Kontoinhaber" {...form.register('account_owner')} />
            </div>
          </FormGrid>
          {form.data.is_paypal ? (
            <FormGrid title="Paypal">
              <div className="col-span-13">
                <FormTextField label="E-Mail-Adresse des Accounts" {...form.register('email')} />
              </div>
            </FormGrid>
          ) : (
            <FormGrid title="Kontoinformationen">
              <div className="col-span-8">
                <FormTextField label="IBAN" {...form.register('iban')} />
              </div>
              <div className="col-span-5">
                <FormTextField label="BIC" {...form.register('bic')} />
              </div>
              <div className="col-span-11">
                <FormTextField label="Name der Bank" {...form.register('bank_name')} />
              </div>
            </FormGrid>
          )}
          {auth.is_accounting_enabled && (
            <FormGrid title="Buchhaltung">
              <div className="col-span-13">
                <FormComboBox
                  isOptional
                  label="Buchhaltungskonto"
                  items={bookkeeping_accounts}
                  {...form.register('bookkeeping_account_id')}
                  itemValue="account_number"
                />
              </div>
              <div className="col-span-6">
                <FormTextField label="Prefix für Nummernkreis" {...form.register('prefix')} />
              </div>
            </FormGrid>
          )}
        </Form>
      </FormCard>
    </PageContainer>
  )
}

export default BankAccountEdit
