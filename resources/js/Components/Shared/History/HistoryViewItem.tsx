/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  AbacusIcon,
  Add01Icon,
  EuroIcon,
  MailValidation01Icon,
  NotificationSquareIcon
} from '@hugeicons/core-free-icons'
import type { FC } from 'react'
import { Avatar } from '@/Components/twc-ui/avatar'
import { Icon } from '@/Components/twc-ui/icon'
import { parseAndFormatDate } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'

interface HistoryItem extends App.Data.NoteableData {
  date: string
}

interface Props {
  item: HistoryItem
}

export const HistoryViewItem: FC<Props> = ({ item }) => {
  const type = item.note.match(/\[([^\]]*)]/g)?.map(match => match.slice(1, -1))[0]
  const note = item.note.replaceAll(/\[[^\]]*]/g, '').trim()

  const getIcon = () => {
    switch (type) {
      case 'mail_sent':
        return MailValidation01Icon
      case 'paid':
        return EuroIcon
      case 'reminder':
        return NotificationSquareIcon
      case 'booked':
        return AbacusIcon
      default:
        return Add01Icon
    }
  }

  const getBgClass = () => {
    switch (type) {
      case 'mail_sent':
        return 'bg-blue-5ßß'
      case 'paid':
        return 'bg-success'
      case 'reminder':
        return 'bg-warning-foreground'
      case 'booked':
        return 'bg-info'
      default:
        return 'bg-muted'
    }
  }

  const getBorderClass = () => {
    switch (type) {
      case 'mail_sent':
        return 'border-blue-5ßß'
      case 'paid':
        return 'border-success'
      case 'reminder':
        return 'border-warning-foreground'
      case 'booked':
        return 'border-info'
      default:
        return 'border-muted'
    }
  }

  return (
    <div className="flex flex-1 flex-col py-2">
      <div className="flex items-center text-sm">
        <div className="w-16">{parseAndFormatDate(item.created_at, 'HH:mm')}</div>
        <div className="mr-2">
          {item.creator?.id ? (
            <Avatar
              size="sm"
              src={item.creator?.avatar_url}
              initials={item.creator?.initials}
              fullname={item.creator?.full_name}
            />
          ) : (
            <div className={cn('rounded-full border', getBorderClass())}>
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-full border-2 border-white',
                  getBgClass()
                )}
              >
                <Icon icon={getIcon()} className="size-5 p-1 text-white" />
              </div>
            </div>
          )}
        </div>
        <div className="text-foreground/70">
          {item.creator?.id ? (
            <span className="text-foreground!">{item.creator?.full_name} </span>
          ) : (
            <span></span>
          )}
          {type ? <span>{note}</span> : <span>hat eine Notize erstellt.</span>}
        </div>
      </div>
      {!type && (
        <div className="mt-2 ml-21 flex-1 rounded-md border bg-background px-4 py-2 text-sm">
          {note}
        </div>
      )}
    </div>
  )
}
