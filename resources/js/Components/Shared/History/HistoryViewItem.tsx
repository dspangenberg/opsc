/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  AbacusIcon,
  Add01Icon,
  EuroIcon,
  Mail01Icon,
  Note01Icon,
  NotificationSquareIcon
} from '@hugeicons/core-free-icons'
import type React from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import robot from '@/Assets/Images/robotic-stroke-rounded.png'
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

export const HistoryViewItem: React.FC<Props> = ({ item }) => {
  const type = item.note.match(/\[([^\]]*)]/g)?.map(match => match.slice(1, -1))[0]
  const note = item.note.replaceAll(/\[[^\]]*]/g, '').trim()

  const getIcon = () => {
    switch (type) {
      case 'mail_sent':
        return Mail01Icon
      case 'paid':
        return EuroIcon
      case 'reminder':
        return NotificationSquareIcon
      case 'booked':
        return AbacusIcon
      case 'created':
        return Add01Icon
      default:
        return Note01Icon
    }
  }

  const getBgClass = () => {
    switch (type) {
      case 'mail_sent':
        return 'bg-blue-500'
      case 'paid':
        return 'bg-success'
      case 'reminder':
        return 'bg-yellow-600'
      case 'booked':
        return 'bg-info'
      default:
        return 'bg-success'
    }
  }

  const getBorderClass = () => {
    switch (type) {
      case 'mail_sent':
        return 'border-blue-500'
      case 'paid':
        return 'border-success'
      case 'reminder':
        return 'border-yellow-600'
      case 'booked':
        return 'border-info'
      default:
        return 'border-success'
    }
  }

  return (
    <div className="flex flex-1 flex-col py-2">
      <div className="flex items-center text-sm">
        <div className="w-16">{parseAndFormatDate(item.created_at, 'HH:mm')}</div>
        <div className="mr-2 w-14">
          <div className="inline-block">
            {item.creator?.id ? (
              <Avatar
                size="md"
                src={item.creator?.avatar_url}
                initials={item.creator?.initials}
                fullname={item.creator?.full_name}
                badge={
                  <div className={cn('rounded-full border', getBorderClass())}>
                    <div
                      className={cn(
                        'relative flex items-center justify-center rounded-full border-2 border-white',
                        getBgClass()
                      )}
                    >
                      <Icon icon={getIcon()} className="size-4 p-0.5 text-white" />
                    </div>
                  </div>
                }
              />
            ) : (
              <Avatar
                size="md"
                src={robot}
                initials="Sys"
                fullname="System"
                imageClassName="size-5 mx-auto my-auto opacity-50"
                badge={
                  <div className={cn('rounded-full border', getBorderClass())}>
                    <div
                      className={cn(
                        'relative flex items-center justify-center rounded-full border-2 border-white',
                        getBgClass()
                      )}
                    >
                      <Icon icon={getIcon()} className="size-4 p-0.5 text-white" />
                    </div>
                  </div>
                }
              />
            )}
          </div>
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
        <div className="ml-30 flex-1 rounded-md border bg-muted px-4 py-2 text-sm">
          <Markdown remarkPlugins={[remarkBreaks]}>{note}</Markdown>
        </div>
      )}
    </div>
  )
}
