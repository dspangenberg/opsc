import { CodeSquareIcon } from '@hugeicons/core-free-icons'
import * as React from 'react'
import { useEffect } from 'react'
import { JSONTree } from 'react-json-tree'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { Button } from '@/Components/twc-ui/button'
import { parseAndFormatDate } from '@/Lib/DateHelper'

interface InboxMailProps {
  mail: App.Data.DropboxInboxData
}

export const InboxMail: React.FC<InboxMailProps> = ({ mail }) => {
  const [showJson, setShowJson] = React.useState<boolean>(false)

  useEffect(() => {
    setShowJson(false)
  }, [mail.id])

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

  return (
    <div className="md-editor mx-auto mt-8 h-fit w-full max-w-4xl space-y-6 rounded-lg border-border/80 border-t bg-background shadow">
      <div className="flex flex-col justify-center gap-2 border-b bg-muted/50 px-8 py-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="w-20 text-right text-muted-foreground">Von:</div>
          <div className="flex-1 font-medium text-base">{mail.from}</div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-20 text-right text-muted-foreground">An:</div>
          <div className="flex-1 font-medium text-base">{mail.to.join(', ')}</div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-20 text-right text-muted-foreground">Betreff:</div>
          <div className="flex-1 font-medium text-base">{mail.subject}</div>
          <div className="text-sm">
            {parseAndFormatDate(mail.date as string, 'dd. MMMM yyyy hh:mm')}
          </div>
        </div>
      </div>
      <div className="px-8 py-4">
        <Markdown remarkPlugins={[remarkBreaks]}>{mail.plain_body}</Markdown>
        {showJson ? (
          <JSONTree data={mail.payload} invertTheme theme={theme} />
        ) : (
          <div>
            <Button
              icon={CodeSquareIcon}
              variant="ghost"
              size="icon"
              onClick={() => setShowJson(true)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
