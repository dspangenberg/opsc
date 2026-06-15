import { CodeSquareIcon, MailUpload01Icon } from '@hugeicons/core-free-icons'
import * as React from 'react'
import { useEffect } from 'react'
import { JSONTree } from 'react-json-tree'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { Button } from '@/Components/twc-ui/button'
import { Form, useForm } from '@/Components/twc-ui/form'
import { FormCheckbox } from '@/Components/twc-ui/form-checkbox'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'
import { parseAndFormatDate } from '@/Lib/DateHelper'

interface InboxMailProps {
  mail: App.Data.DropboxInboxData
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
}

type FormData = {
  contact_id: number
  project_id: number
  is_private: boolean
  use_attachments: boolean
}

export const InboxMail: React.FC<InboxMailProps> = ({ mail, contacts, projects }) => {
  const [showJson, setShowJson] = React.useState<boolean>(false)

  useEffect(() => {
    setShowJson(false)
  }, [mail.id])

  const form = useForm<FormData>(
    'mail-form',
    'put',
    route('app.inbox.import', {
      mail: mail.id
    }),
    {
      contact_id: 0,
      project_id: 0,
      is_private: mail.is_private,
      use_attachments: true
    }
  )

  form.transform((data: any) => ({
    ...data,
    project_id: !data.project_id ? null : data.project_id
  }))

  useEffect(() => {
    const fromMail = contacts.find(item => item.primary_mail === mail.from)
    if (fromMail) {
      form.setData('contact_id', fromMail.id as number)
    } else {
      for (const to of mail.to) {
        const toMail = contacts.find(item => item.primary_mail === to)
        if (toMail) {
          form.setData('contact_id', toMail.id as number)
        } else {
          form.setData('contact_id', 0)
        }
      }
    }
  }, [mail.from, mail.to, contacts])

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
          <div className="w-16 text-right text-muted-foreground">Von:</div>
          <div className="flex-1 font-medium text-base">{mail.from}</div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-16 text-right text-muted-foreground">An:</div>
          <div className="flex-1 font-medium text-base">{mail.to.join(', ')}</div>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="w-16 text-right text-muted-foreground">Betreff:</div>
          <div className="flex-1 font-medium text-base">{mail.subject}</div>
          <div className="text-sm">
            {parseAndFormatDate(mail.date as string, 'dd. MMMM yyyy HH:mm')}
          </div>
        </div>
      </div>
      <div className="m-4 mt-0 rounded-md border border-dashed">
        <Form form={form}>
          <FormGrid>
            <div className="col-span-11">
              <FormComboBox
                label="Kontakt"
                items={contacts}
                itemName="reverse_full_name"
                {...form.register('contact_id')}
              />
              <div className="pt-1">
                <FormCheckbox label="privat" {...form.registerCheckbox('is_private')} />
              </div>
            </div>
            <div className="col-span-11">
              <FormComboBox
                label="Projekt"
                isOptional
                items={projects}
                {...form.register('project_id')}
              />
              <div className="pt-1">
                <FormCheckbox
                  label="Anlagen übernehmen"
                  {...form.registerCheckbox('use_attachments')}
                />
              </div>
            </div>
            <div className="pt-5">
              <Button
                icon={MailUpload01Icon}
                tooltip="E-Mail übernehmen"
                form={form.id}
                type="submit"
                size="icon"
                variant="default"
                className="h-9"
              />
            </div>
          </FormGrid>
        </Form>
      </div>
      <div className="px-8 py-4">
        <Markdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="md-a">
                {children}
              </a>
            )
          }}
        >
          {mail.plain_body}
        </Markdown>
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
