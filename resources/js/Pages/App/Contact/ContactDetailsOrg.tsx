import { Add01Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import type { FC } from 'react'
import { DataCard, DataCardContent, DataCardField, DataCardSection } from '@/Components/DataCard'
import { StatsField } from '@/Components/StatsField'
import { ContactDetailsAddresses } from '@/Pages/App/Contact/ContactDetailsAddresses'
import { ContactDetailsMail } from '@/Pages/App/Contact/ContactDetailsMails'
import { ContactDetailsPhone } from '@/Pages/App/Contact/ContactDetailsPhones'

interface ContactDetailsOrgInfoBoxProps {
  contact: App.Data.ContactData | App.Data.CompanyData
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
  const handleAddButtonClick = () => {}

  const salesCurrentYearTitle = `Umsatz ${new Date().getFullYear().toString()}`

  return (
    <DataCard title={contact.full_name}>
      {contact.debtor_number && (
        <DataCardContent>
          <div className="grid w-full grid-cols-2 divide-x divide-border/50 rounded-md border border-border/50 border-b bg-background p-1.5">
            <StatsField
              label={salesCurrentYearTitle}
              value={currencyFormatter.format(contact.sales?.currentYear || 0)}
            />
            <StatsField
              label="Gesamtumsatz"
              value={currencyFormatter.format(contact.sales?.allTime || 0)}
            />
          </div>
        </DataCardContent>
      )}
      <DataCardContent showSecondary={showSecondary}>
        <DataCardSection
          title="Debitorinfos"
          suppressEmptyText
          className="grid grid-cols-2"
          icon={Edit02Icon}
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
          <DataCardField variant="vertical" label="Umsatzsteuer" value={contact.tax?.name} />
        </DataCardSection>
        <DataCardSection
          suppressEmptyText
          className="grid grid-cols-2"
          title="Kreditorinfos"
          icon={Edit02Icon}
        >
          <DataCardField
            variant="vertical"
            label="Kreditornr."
            value={contact.formated_creditor_number}
          />
          <DataCardField
            variant="vertical"
            label="Kostenstelle"
            value={contact.cost_center?.name}
          />
        </DataCardSection>
        <DataCardSection
          title="Telefonnummern"
          icon={Add01Icon}
          forceChildren={(contact.phones?.length ?? 0) > 0}
          emptyText="Keine Telefonnummern vorhanden"
        >
          <ContactDetailsPhone phones={contact.phones || []} />
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
