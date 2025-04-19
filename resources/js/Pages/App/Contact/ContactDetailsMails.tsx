/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import type * as React from 'react'
import { type FC, useState } from 'react'
import { DataCardSection } from '@/Components/DataCard'
import { Edit02Icon, Add02Icon } from '@hugeicons/core-free-icons'
import { ContactDetailsMailField } from '@/Pages/App/Contact/ContactDetailsMailsField'

interface Props {
  mails: App.Data.ContactMailData[]
}

export const ContactDetailsMail: FC<Props> = ({ mails }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleToggle = () => {
    setIsOpen(prevState => !prevState)
  }

  const handleAddButtonClick = () => {}

  const icon = mails.length ? Edit02Icon : Add02Icon
  if (!mails.length) return null

  return (
    <>
      {mails.map((mail, index) => (
        <ContactDetailsMailField mail={mail} key={mail.id || index} />
      ))}
    </>
  )
}
