import { Delete02Icon, FolderUploadIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type * as React from 'react'
import { JSONTree } from 'react-json-tree'
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

  const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633'
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
          <div className="md-editor mx-auto mt-8 h-fit w-full max-w-4xl space-y-6 rounded-lg border-t bg-background py-6 shadow">
            <div className="px-8 py-2">{mail.from}</div>
            <div className="px-8 py-2">{mail.to.join(', ')}</div>
            <div className="px-8">
              <Markdown remarkPlugins={[remarkBreaks]}>{mail.plain_body}</Markdown>
            </div>
            <JSONTree data={mail.payload} invertTheme theme={theme} />
          </div>
        )}
      </div>
    </PageContainerWithSideOnLeft>
  )
}

export default InboxIndex
