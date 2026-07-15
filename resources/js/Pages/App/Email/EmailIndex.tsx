import {
  ArchiveRestoreIcon,
  ArchiveXIcon,
  Delete02Icon,
  DeletePutBackIcon,
  MailSend02Icon
} from '@hugeicons/core-free-icons'
import { router, usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useCallback } from 'react'
import { PageContainerWithSideOnLeft } from '@/Components/PageContainerWithSideOnLeft'
import { DropdownButton } from '@/Components/twc-ui/dropdown-button'
import { MenuItem } from '@/Components/twc-ui/menu'
import { toast } from '@/Components/twc-ui/sonner'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import EmailSnoozeButton from '@/Pages/App/Email/EmailSnoozeButton'
import { EmailView } from '@/Pages/App/Email/EmailView'
import type { PageProps } from '@/Types'
import { Email } from './Email'
import { EmailIndexEntry } from './EmailIndexEntry'

interface InboxIndexProps extends PageProps {
  mails: App.Data.Paginated.PaginationMeta<App.Data.DropboxMailData[]>
  mail?: App.Data.DropboxMailData | null
  dropbox: App.Data.DropboxData
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
}

const EmailIndex: React.FC<InboxIndexProps> = ({ contacts, dropbox, mail, mails, projects }) => {
  const dropboxes = usePage().props.auth.dropboxes?.filter(item => item.id !== dropbox.id) || []
  const view = route().params.view ?? 'inbox'

  const handleRestore = async () => {
    if (!mail) return
    router.put(route('app.email.restore', { dropbox: dropbox.id, mail: mail.id }))
  }

  const handleUnarchive = useCallback(async () => {
    router.put(
      route('app.email.unarchive', { dropbox: dropbox.id, mail: mail?.id }),
      {},
      {
        onSuccess: () => {
          toast({
            type: 'success',
            message: `Die E-Mail wurde zurück in den Posteingang verschoben.`
          })
        }
      }
    )
  }, [mail?.id, dropbox.id])

  const handleTrash = useCallback(async () => {
    router.delete(route('app.email.trash', { dropbox: dropbox.id, mail: mail?.id }), {
      onSuccess: () => {
        toast({
          type: 'success',
          message: `Die E-Mail wurde in den Papierkorb verschoben.`,
          button: {
            onClick: () => handleRestore(),
            label: 'Undo'
          }
        })
      }
    })
  }, [mail?.id, dropbox.id])

  const handleArchive = useCallback(async () => {
    router.put(
      route('app.email.archive', { dropbox: dropbox.id, mail: mail?.id }),
      {},
      {
        onSuccess: () => {
          toast({
            type: 'success',
            message: `Die E-Mail wurde archiviert.`,
            button: {
              onClick: () => handleUnarchive(),
              label: 'Undo'
            }
          })
        }
      }
    )
  }, [mail?.id, handleUnarchive, dropbox.id])

  const handleMove = async (newDropbox: number) => {
    if (!mail) return
    router.put(route('app.email.move', { dropbox: dropbox.id, mail: mail.id, newDropbox }))
  }

  const toolbar = (
    <Toolbar isDisabled={!mail}>
      <DropdownButton
        variant="toolbar"
        size="icon"
        title="In andere Dropbox verschieben"
        icon={MailSend02Icon}
        isDisabled={!mail}
      >
        {dropboxes.map(item => (
          <MenuItem
            key={item.email_address}
            title={item.name}
            ellipsis
            hideIcon
            onAction={() => handleMove(item.id as number)}
          />
        ))}
      </DropdownButton>

      {(view === 'inbox' || view === 'sent' || view === 'snoozed') && (
        <EmailSnoozeButton mail={mail} dropbox={dropbox} />
      )}

      {(view === 'inbox' || view === 'sent') && (
        <ToolbarButton
          isDisabled={!mail}
          icon={ArchiveXIcon}
          size="icon"
          title="E-Mail archivieren"
          onClick={handleArchive}
        />
      )}

      {view === 'archived' && (
        <ToolbarButton
          isDisabled={!mail}
          icon={ArchiveRestoreIcon}
          size="icon"
          title="E-Mail zurücklegen"
          onClick={handleUnarchive}
        />
      )}

      {view === 'trash' && (
        <ToolbarButton
          isDisabled={!mail}
          icon={DeletePutBackIcon}
          size="icon"
          title="E-Mail zurücklegen"
          onClick={handleRestore}
        />
      )}

      {view !== 'trash' && (
        <ToolbarButton
          isDisabled={!mail}
          icon={Delete02Icon}
          size="icon"
          variant="ghost-destructive"
          title="E-Mail in den Papierkorb verschieben"
          onClick={handleTrash}
        />
      )}
    </Toolbar>
  )

  return (
    <PageContainerWithSideOnLeft
      leftHeader={
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="font-bold text-xl">{dropbox.name}</div>
          <div className="text-sm">{dropbox.email_address}</div>
        </div>
      }
      toolbar={toolbar}
      width="full"
      className="relative m-0 mx-0 h-full p-0 px-0"
    >
      <div className="absolute top-0 bottom-0 w-48 border-r">
        <div className="m-8 text-sm">
          <ul className="leading-relaxed">
            <EmailView view="inbox" label="Posteingang" dropbox={dropbox} />
            <EmailView view="sent" label="Gesendet" dropbox={dropbox} />
            <EmailView view="archived" label="Archiv" dropbox={dropbox} />
            <EmailView view="snoozed" label="Erneut erinnern" dropbox={dropbox} />
            <EmailView view="trash" label="Papierkorb" dropbox={dropbox} />
          </ul>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 left-48 w-96 border-r">
        <div className="h-full overflow-y-auto">
          <div className="flex flex-col gap-2 p-4">
            {mails.data.map(item => (
              <EmailIndexEntry
                key={item.id}
                dropbox={dropbox}
                view={route().params.view as 'inbox' | 'sent' | 'archived' | 'trash' | 'snoozed'}
                mail={item}
                isActive={item.id === mail?.id}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-144 flex">
        <div className="mx-auto h-full overflow-y-auto">
          {mail && <Email mail={mail} contacts={contacts} projects={projects} />}
        </div>
      </div>
    </PageContainerWithSideOnLeft>
  )
}

export default EmailIndex
