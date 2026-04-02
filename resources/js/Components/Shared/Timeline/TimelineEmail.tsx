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
import { useState } from 'react'
import { Pressable } from 'react-aria-components'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { Icon } from '@/Components/twc-ui/icon'
import { Tooltip, TooltipTrigger } from '@/Components/twc-ui/tooltip'
import { formatDateDistance, parseAndFormatDate } from '@/Lib/DateHelper'
import { cn } from '@/Lib/utils'

interface Props {
  item: App.Data.DropboxMailData
}

export const TimelineEmail: React.FC<Props> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div className="mr-6 flex flex-1 items-center py-2 text-sm">
        <div className="flex w-12 items-center justify-center">
          <div className="inline-block">
            <div className={cn('rounded-full border border-blue-500 p-0.5')}>
              <div className={cn('rounded-full p-1', 'bg-blue-500')}>
                <Icon icon={Mail01Icon} className="size-3.5 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-1 text-foreground/70">
          <div>
            {item.from} an {item.to.join(', ')}
          </div>
        </div>

        <div className="mr-6 text-foreground/50 text-sm">
          <TooltipTrigger>
            <Pressable>
              <span role="button">{formatDateDistance(item.date as string)}</span>
            </Pressable>
            <Tooltip>
              <span>{parseAndFormatDate(item.date as string, 'dd.MM.yyyy HH:mm')}</span>
            </Tooltip>
          </TooltipTrigger>
        </div>
      </div>

      <button className="relative text-left" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="absolute top-0 bottom-0 w-12">
          <div className="absolute top-0 bottom-0 left-1/2 border-gray-300 border-l" />
        </div>
        <div className="md-editor mr-6 ml-12 block rounded-md border bg-background p-2.5 text-sm">
          <div className="pb-3 font-medium">{item.subject}</div>
          {isExpanded ? (
            <div>
              <Markdown remarkPlugins={[remarkBreaks]}>{item.body}</Markdown>
            </div>
          ) : (
            <div className="my-2 line-clamp-2">{item.body}</div>
          )}
        </div>
      </button>
    </>
  )
}
