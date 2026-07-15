import { NotificationSnooze01Icon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import {
  format,
  isFuture,
  isToday,
  nextFriday,
  nextMonday,
  setHours,
  setMinutes,
  startOfToday,
  startOfTomorrow
} from 'date-fns'
import { de } from 'date-fns/locale'
import type * as React from 'react'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem, MenuSeparator } from '@/Components/twc-ui/menu'

interface EmailSnoozeButtonProps {
  mail: App.Data.DropboxMailData
  dropbox: App.Data.DropboxData
}

interface SnoozeItem {
  title: string
  date: Date
}

const EmailSnoozeButton: React.FC<EmailSnoozeButtonProps> = ({ dropbox, mail }) => {
  const endOfWeek = () => {
    return setMinutes(nextFriday(new Date()), 0)
  }

  const nextWeek = () => {
    return setMinutes(nextMonday(new Date()), 0)
  }

  const snoozeOptions: SnoozeItem[] = [
    {
      title: 'Heute Mittag',
      date: setHours(startOfToday(), 12)
    },
    {
      title: 'Heute Abend',
      date: setHours(startOfToday(), 17)
    },
    {
      title: 'Morgen',
      date: setHours(startOfTomorrow(), 9)
    },
    {
      title: 'Ende der Woche',
      date: setHours(endOfWeek(), 9)
    },
    {
      title: 'Nächste Woche',
      date: setHours(nextWeek(), 9)
    }
  ]

  const formatShortcut = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: de })
    } else {
      return format(date, 'EEEEEE, HH:mm', { locale: de })
    }
  }

  const filteredOptions = snoozeOptions.filter(item => isFuture(item.date))

  const onSnooze = (date: Date) => {
    router.put(
      route('app.email.snooze', {
        dropbox: dropbox.id,
        mail: mail.id
      }),
      { snoozed_until: format(date, 'dd.MM.yyyy HH:mm') }
    )
  }

  const onUnSnooze = () => {
    router.put(
      route('app.email.unsnooze', {
        dropbox: dropbox.id,
        mail: mail.id
      })
    )
  }

  return (
    <DropdownButton variant="ghost" icon={NotificationSnooze01Icon} isDisabled={!mail}>
      {filteredOptions.map(item => (
        <MenuItem
          key={item.date.toISOString()}
          hideIcon
          title={item.title}
          shortcut={formatShortcut(item.date)}
          onAction={() => onSnooze(item.date)}
        />
      ))}
      <MenuSeparator />
      <MenuItem hideIcon title="Erinnerung löschen" onAction={onUnSnooze} />
    </DropdownButton>
  )
}

export default EmailSnoozeButton
