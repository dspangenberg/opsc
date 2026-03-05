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
  NotificationSquareIcon,
  StatusIcon
} from '@hugeicons/core-free-icons'
import type React from 'react'
import { Pressable } from 'react-aria-components'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { Icon } from '@/Components/twc-ui/icon'
import { Tooltip, TooltipTrigger } from '@/Components/twc-ui/tooltip'
import { formatDateDistance, parseAndFormatDate } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'

interface Props {
  item: App.Data.NoteableData
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
      case 'status.info':
      case 'status.destructive':
      case 'status.success':
        return StatusIcon
      default:
        return Note01Icon
    }
  }

  const getBgClass = () => {
    switch (type) {
      case 'mail_sent':
      case 'status.info':
        return 'bg-blue-500'
      case 'paid':
      case 'created':
      case 'status.success':
        return 'bg-success'
      case 'reminder':
        return 'bg-yellow-600'
      case 'booked':
        return 'bg-info'
      case 'note':
        return 'bg-muted'
      case 'status.destructive':
        return 'bg-destructive'
      default:
        return 'bg-info'
    }
  }

  const getBorderClass = () => {
    switch (type) {
      case 'mail_sent':
      case 'status.info':
        return 'border-blue-500'
      case 'paid':
      case 'created':
      case 'status.success':
        return 'border-success'
      case 'reminder':
        return 'border-yellow-600'
      case 'booked':
        return 'border-info'
      case 'status.destructive':
        return 'border-destructive'
      default:
        return 'border-info'
    }
  }

  return (
    <>
      <div className="mr-6 flex flex-1 items-center py-2 text-sm">
        <div className="flex w-12 items-center justify-center">
          <div className="inline-block">
            <div className={cn('rounded-full border p-0.5', getBorderClass())}>
              <div className={cn('rounded-full p-1', getBgClass())}>
                <Icon icon={getIcon()} className="size-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-1 text-foreground/70">
          {item.creator?.id && (
            <div className="flex items-center gap-1">{item.creator?.full_name}</div>
          )}
          <div>{type ? <Markdown>{note}</Markdown> : <div>hat eine Notiz erstellt.</div>}</div>
        </div>

        <div className="mr-6 text-foreground/50 text-sm">
          <TooltipTrigger>
            <Pressable>
              <span role="button">{formatDateDistance(item.created_at)}</span>
            </Pressable>
            <Tooltip>
              <span>{parseAndFormatDate(item.created_at, 'dd.MM.yyyy HH:mm')}</span>
            </Tooltip>
          </TooltipTrigger>
        </div>
      </div>
      {!type && (
        <div className="relative">
          <div className="absolute top-0 bottom-0 w-12">
            <div className="absolute top-0 bottom-0 left-1/2 border-gray-300 border-l" />
          </div>
          <div className="mr-6 ml-12 rounded-md border bg-background p-2.5 text-sm leading-normal">
            <Markdown remarkPlugins={[remarkBreaks]}>{note}</Markdown>
          </div>
        </div>
      )}
    </>
  )
}
