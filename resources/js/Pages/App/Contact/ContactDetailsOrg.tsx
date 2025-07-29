import { DataCard, DataCardContent, DataCardField, DataCardSection } from '@/Components/DataCard'
import { ContactDetailsAddresses } from '@/Pages/App/Contact/ContactDetailsAddresses'
import { ContactDetailsMail } from '@/Pages/App/Contact/ContactDetailsMails'
import { Add01Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { useModalStack } from '@inertiaui/modal-react' // Temporarily disabled
import type { FC } from 'react'

interface ContactDetailsOrgInfoBoxProps {
  contact: App.Data.ContactData
  showSecondary?: boolean
}

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

  return (
    <DataCard title={contact.full_name}>
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
