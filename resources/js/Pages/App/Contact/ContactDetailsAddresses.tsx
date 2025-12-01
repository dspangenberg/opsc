import { Copy01Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import type { FC } from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { DataCardField, DataCardFieldGroup } from '@/Components/DataCard'
import { Button } from '@/Components/ui/twc-ui/button'

interface Props {
  addresses: App.Data.ContactAddressData[]
}

export const ContactDetailsAddresses: FC<Props> = ({ addresses }: Props) => {
  const firstAddress = addresses.length ? addresses[0] : null

  const handleEditButtonClick = () => {
    console.log('Edit address clicked - modal functionality temporarily disabled')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(firstAddress?.full_address as string)
  }

  return (
    <DataCardFieldGroup>
      {firstAddress ? (
        <DataCardField variant="vertical" label={firstAddress.category?.name || 'Adresse'}>
          <div className="group/address flex items-center gap-0.5">
            <div className="flex-1 text-wrap">
              <Markdown remarkPlugins={[remarkBreaks]}>{firstAddress.full_address}</Markdown>
            </div>
            <div className="flex-none space-x-1 self-start">
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
