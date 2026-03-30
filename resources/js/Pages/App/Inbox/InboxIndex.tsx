import { Delete02Icon, FolderUploadIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { PageContainerWithSideOnLeft } from '@/Components/PageContainerWithSideOnLeft'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { InboxIndexEntry } from './InboxIndexEntry'

interface InboxIndexProps extends PageProps {
  mails: App.Data.Paginated.PaginationMeta<App.Data.DropboxInboxData[]>
  mail?: App.Data.DropboxInboxData
}

const InboxIndex: React.FC<InboxIndexProps> = ({ mails, mail }) => {
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
            {mails.data.map(mail => (
              <InboxIndexEntry key={mail.id} mail={mail} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-96 flex">
        {mail && (
          <div className="md-editor mx-auto mt-12 w-full max-w-4xl space-y-6">
            <div className="px-8 py-2">{mail.from}</div>
            <div className="px-8">
              <Markdown remarkPlugins={[remarkBreaks]}>{mail.plain_body}</Markdown>
            </div>
          </div>
        )}
      </div>
    </PageContainerWithSideOnLeft>
  )
}

export default InboxIndex
