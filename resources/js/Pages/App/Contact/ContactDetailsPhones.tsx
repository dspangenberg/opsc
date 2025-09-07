/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Add02Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { type FC, useState } from 'react'
import { DataCardSection } from '@/Components/DataCard'
import { ContactDetailsPhoneField } from '@/Pages/App/Contact/ContactDetailsPhoneField'

interface Props {
  phones: App.Data.ContactPhoneData[]
}

export const ContactDetailsPhone: FC<Props> = ({ phones }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleToggle = () => {
    setIsOpen(prevState => !prevState)
  }

  const handleAddButtonClick = () => {}

  const icon = phones.length ? Edit02Icon : Add02Icon
  if (!phones.length) return null

  return (
    <>
      {phones.map((phone, index) => (
        <ContactDetailsPhoneField phone={phone} key={phone.id || index} />
      ))}
    </>
  )
}
