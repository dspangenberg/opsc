/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Bookmark01Icon,
  EuroCircleIcon,
  MailValidation01Icon,
  PinOffIcon
} from '@hugeicons/core-free-icons'
import type { FC } from 'react'
import { Avatar } from '@/Components/twc-ui/avatar'
import { Icon } from '@/Components/twc-ui/icon'
import { parseAndFormatDate } from '@/Lib/DateHelper'

interface HistoryItem extends App.Data.NoteableData {
  date: string
}

interface Props {
  item: HistoryItem
}

export const HistoryViewItem: FC<Props> = ({ item }) => {
  const getIcon = (item: HistoryItem) => {
    const type = item.note.match(/\[([^\]]*)]/g)?.map(match => match.slice(1, -1))[0]
    switch (type) {
      case 'mail_sent':
        return MailValidation01Icon
      case 'paid':
        return EuroCircleIcon
      default:
        return Bookmark01Icon
    }
  }

  const type = item.note.match(/\[([^\]]*)]/g)?.map(match => match.slice(1, -1))[0]
  const note = item.note.replaceAll(/\[[^\]]*]/g, '').trim()

  return (
    <div className="flex flex-col">
      <div className="flex items-center text-sm">
        <div className="w-24">{parseAndFormatDate(item.created_at, 'HH:mm')}</div>
        <div className="relative mx-2 py-2 first-child:py-0">
          <div className="absolute top-0 bottom-0 left-1/2 border-gray-600 border-l"></div>
          {item.creator?.id ? (
            <Avatar
              size="sm"
              src={item.creator?.avatar_url}
              initials={item.creator?.initials}
              fullname={item.creator?.full_name}
            />
          ) : (
            <div className="relative flex size-7 items-center justify-center rounded-full">
              <Icon
                icon={getIcon(item)}
                className="size-6 rounded-full border border-white bg-blue-500 p-0.5 text-white"
              />
            </div>
          )}
        </div>
        <div>
          {item.creator?.id ? <span>{item.creator?.full_name} </span> : <span></span>}
          {note}
        </div>
      </div>
    </div>
  )
}
