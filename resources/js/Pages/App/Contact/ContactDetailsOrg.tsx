import { DataCard, DataCardContent, DataCardField, DataCardHeader, DataCardSection } from '@/Components/DataCard'
import { ContactDetailsAddresses } from '@/Pages/App/Contact/ContactDetailsAddresses'
import { ContactDetailsMail } from '@/Pages/App/Contact/ContactDetailsMails'
import { Add01Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { useModalStack } from '@inertiaui/modal-react' // Temporarily disabled
import type { FC } from 'react'
import { cn } from '@/Lib/utils'
import { StatsField } from '@/Components/StatsField'
import type * as React from 'react'

interface ContactDetailsOrgInfoBoxProps {
  contact: App.Data.ContactData
  showSecondary?: boolean
}

const currencyFormatter = new Intl.NumberFormat('de-DE', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

export const ContactDetailsOrg: FC<ContactDetailsOrgInfoBoxProps> = ({
  contact,
  showSecondary
}: ContactDetailsOrgInfoBoxProps) => {
  const onDebtorDataClicked = () => {
    console.log('Debtor data clicked')
  }
  const { visitModal } = useModalStack() // Temporarily disabled

  const handleAddButtonClick = () => {
    visitModal(
      route('app.contact.create.address', {
        contact: contact.id
      }),
      {
        navigate: true
      }
    )
  }

  const salesCurrentYearTitle = `Umsatz ${new Date().getFullYear().toString()}`

  return (
    <DataCard title={contact.full_name}>
      <DataCardContent>
        <div
          className="grid w-full divide-x rounded-md border bg-white divide-border/50 border-b border-border/50 p-1.5 grid-cols-2"
        >
          <StatsField label={salesCurrentYearTitle} value={currencyFormatter.format(contact.sales.currentYear)} />
          <StatsField label="Gesamtumsatz" value={currencyFormatter.format(contact.sales.allTime)} />
        </div>
      </DataCardContent>
      <DataCardContent showSecondary={showSecondary}>
        <DataCardSection
          title="Debitorinfos"
          icon={Edit02Icon}
          onClick={onDebtorDataClicked}
          buttonTooltip="Debitorinfos bearbeiten"
        >
          <DataCardField
            variant="vertical"
            label="Kunden- und Debitornr."
            value={contact.formated_debtor_number}
          />
          <DataCardField
            variant="vertical"
            label="Zahlungsziel"
            value={contact.payment_deadline?.name}
          />
        </DataCardSection>
        <DataCardSection
          secondary
          className="grid grid-cols-2"
          title="Kreditorinfos"
          icon={Edit02Icon}
          onClick={onDebtorDataClicked}
        >
          <DataCardField
            variant="vertical"
            label="Kreditornr."
            value={contact.formated_creditor_number}
          />
        </DataCardSection>

        <DataCardSection
          secondary
          title="E-Mail-Adressen"
          icon={Add01Icon}
          forceChildren={(contact.mails?.length ?? 0) > 0}
          onClick={() => {
            handleAddButtonClick()
          }}
          emptyText="Keine E-Mail-Adressen vorhanden"
        >
          <ContactDetailsMail mails={contact.mails || []} />
        </DataCardSection>
        <DataCardSection
          secondary
          title="Anschriften"
          icon={Add01Icon}
          forceChildren={true}
          onClick={() => {
            handleAddButtonClick()
          }}
          emptyText="Keine Anschriften vorhanden"
        >
          <ContactDetailsAddresses addresses={contact.addresses || []} />
        </DataCardSection>
        <DataCardSection
          title="Register- und Steuerdaten"
          icon={Edit02Icon}
          secondary
          suppressEmptyText={true}
        >
          {contact.register_number && (
            <DataCardField variant="vertical" label="Register" value={contact.register_number}>
              {contact.register_court} ({contact.register_number})
            </DataCardField>
          )}
          <div className="grid grid-cols-2 gap-2">
            <DataCardField variant="vertical" label="Umsatzsteuer-ID" value={contact.vat_id} />
            <DataCardField variant="vertical" label="Steuernummer" value={contact.tax_number} />
          </div>
        </DataCardSection>
      </DataCardContent>
    </DataCard>
  )
}
