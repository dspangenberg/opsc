/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import { type FC, useState } from 'react'
import { DataCardField, DataCardSection, DataCardSectionHeader } from '@/Components/DataCard'
import { UnfoldMoreIcon, Add01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@dspangenberg/twcui'

interface Props {
  mails: App.Data.ContactMailData[]
}

export const ContactDetailsMail: FC<Props> = ({ mails }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleToggle = () => {
    setIsOpen(prevState => !prevState)
  }

  const handleAddButtonClick = () => {}

  const firstMail = mails[0]
  const remainingMails = mails.slice(1)
  const addOnText: string =
    remainingMails.length > 0 ? `(+${remainingMails.length.toString()})` : ''

  return (
    <DataCardSection>
      <DataCardSectionHeader icon={Add01Icon} onClick={handleAddButtonClick}>
        <div className="flex items-center">
          E-Mails <span className="font-normal text-foreground/60 px-1">{addOnText}</span>
          <Button variant="ghost" size="icon-sm" icon={UnfoldMoreIcon} onClick={handleToggle} />
        </div>
      </DataCardSectionHeader>

      <DataCardField
        variant="vertical"
        label={firstMail.category?.name || 'E-Mail'}
        value={firstMail.email}
      />

      {isOpen &&
        remainingMails.map((mail, index) => (
          <DataCardField
            key={mail.id || index}
            variant="vertical"
            label={mail.category?.name || 'E-Mail'}
            value={mail.email}
          />
        ))}
    </DataCardSection>
  )
}
