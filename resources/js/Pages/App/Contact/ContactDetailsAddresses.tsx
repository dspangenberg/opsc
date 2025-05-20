import type * as React from 'react'
import type { FC } from 'react'
import { DataCardField, DataCardFieldGroup } from '@/Components/DataCard'
import { Button } from '@dspangenberg/twcui'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { PencilEdit02Icon, Copy01Icon } from '@hugeicons/core-free-icons'
import { useModalStack } from '@inertiaui/modal-react'
import { router } from '@inertiajs/react'

interface Props {
  addresses: App.Data.ContactAddressData[]
}

export const ContactDetailsAddresses: FC<Props> = ({ addresses }: Props) => {
  const firstAddress = addresses.length ? addresses[0] : null
  const { visitModal } = useModalStack()

  const handleEditButtonClick = () => {
    visitModal(
      route('app.contact.edit.address', {
        contact: firstAddress?.contact_id,
        address: firstAddress?.id
      })
    )
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(firstAddress?.full_address as string)
  }

  return (
    <DataCardFieldGroup>
      {firstAddress ? (
        <DataCardField variant="vertical" label={firstAddress.category?.name || 'Adresse'}>
          <div className="flex items-center gap-0.5 group/address">
            <div className="flex-1">
              <Markdown remarkPlugins={[remarkBreaks]}>{firstAddress.full_address}</Markdown>
            </div>
            <div className="flex-none self-start space-x-1">
              <Button
                variant="outline"
                size="icon-xs"
                iconClassName="text-primary"
                className="opacity-0 group-hover/address:opacity-100"
                tooltip="Anschrift in Zwischenablage kopieren"
                icon={Copy01Icon}
                onClick={handleCopy}
              />
              <Button
                variant="outline"
                size="icon-xs"
                iconClassName="text-primary"
                className="opacity-0 group-hover/address:opacity-100"
                tooltip="Anschrift bearbeiten"
                onClick={handleEditButtonClick}
                icon={PencilEdit02Icon}
              />
            </div>
          </div>
        </DataCardField>
      ) : (
        <div className="text-foreground/40">Keine Anschriften gefunden</div>
      )}
    </DataCardFieldGroup>
  )
}
