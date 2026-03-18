import { FolderUploadIcon } from '@hugeicons/core-free-icons'
import { PageContainerWithSideOnLeft } from '@/Components/PageContainerWithSideOnLeft'
import { Toolbar, ToolbarButton } from '@/Components/twc-ui/toolbar'
import type { PageProps } from '@/Types'
import { InboxIndexEntry } from './InboxIndexEntry'

interface InboxIndexProps extends PageProps {
  mails: App.Data.Paginated.PaginationMeta<App.Data.InboxEntryData[]>
}

const InboxIndex: React.FC<InboxIndexProps> = ({ mails }) => {
  const toolbar = (
    <Toolbar>
      <ToolbarButton variant="primary" icon={FolderUploadIcon} title="MultiDoc hochladen" />
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
    </PageContainerWithSideOnLeft>
  )
}

export default InboxIndex
