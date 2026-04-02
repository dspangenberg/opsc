import { Delete02Icon, FolderUploadIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { PageContainerWithSideOnLeft } from '@/Components/PageContainerWithSideOnLeft'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import { InboxMail } from '@/Pages/App/Inbox/InboxMail'
import type { PageProps } from '@/Types'
import { InboxIndexEntry } from './InboxIndexEntry'

interface InboxIndexProps extends PageProps {
  mails: App.Data.Paginated.PaginationMeta<App.Data.DropboxInboxData[]>
  mail?: App.Data.DropboxInboxData
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
}

const InboxIndex: React.FC<InboxIndexProps> = ({ contacts, mail, mails, projects }) => {
  const handleDelete = async () => {
    if (!mail) return
    const promise = await AlertDialog.call({
      title: 'E-Mail löschen',
      message: `Möchtest Du die E-Mail wirklich löschen?`,
      buttonTitle: 'Löschen'
    })
    if (promise) {
      router.delete(route('app.inbox.destroy', { mail: mail.id }))
    }
  }

  const toolbar = (
    <Toolbar isDisabled={!mail}>
      <ToolbarButton variant="primary" icon={FolderUploadIcon} title="MultiDoc hochladen" />
      <ToolbarButton icon={Delete02Icon} title="E-Mail löschen" onClick={handleDelete} />
    </Toolbar>
  )

  return (
    <PageContainerWithSideOnLeft
      title="Inbox"
      toolbar={toolbar}
      width="full"
      className="relative m-0 mx-0 h-full p-0 px-0"
    >
      <div className="absolute top-0 bottom-0 w-96 border-r">
        <div className="h-full overflow-y-auto">
          <div className="flex flex-col gap-2 p-4">
            {mails.data.map(item => (
              <InboxIndexEntry key={item.id} mail={item} isActive={item.id === mail?.id} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-96 flex">
        {mail && <InboxMail mail={mail} contacts={contacts} projects={projects} />}
      </div>
    </PageContainerWithSideOnLeft>
  )
}

export default InboxIndex
