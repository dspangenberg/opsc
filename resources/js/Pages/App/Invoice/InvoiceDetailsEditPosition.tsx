import { createCallable } from 'react-call'
import type * as React from 'react'
import { Button } from '@dspangenberg/twcui'
import { ResponsiveDialog } from '@/Components/ResponsiveDialog'
import { Delete04Icon, MoreVerticalIcon, FloppyDiskIcon, InsertRowIcon, Pdf02Icon } from '@hugeicons/core-free-icons'

interface Props {
  invoice: App.Data.InvoiceData
  invoiceLine: App.Data.InvoiceLineData
}

export const InvoiceDetailsEditPosition = createCallable<Props, boolean>(
  ({ call, invoice, invoiceLine }) => (
    <ResponsiveDialog
      isOpen={true}
      onClose={() => call.end(false)}
      className="max-w-xl bg-white"
      description="Rechnungsposition bearbeiten"
      title="Rechnungsposition bearbeiten"
      dismissible={true}
      footer={
        <div className="flex items-start flex-1 justify-start border-4">
          <div className="items-center flex flex-none space-x-2">
            <Button variant="ghost" iconClassName="text-primary" size="icon" icon={MoreVerticalIcon} onClick={() => call.end(false)} />
          </div>
          <div className="flex-1 space-x-2 justify-end items-center flex">
            <Button variant="outline" onClick={() => call.end(false)}>
              Abbrechen
            </Button>
            <Button form="clientForm" variant="default" onClick={() => call.end(true)}>
              Position speichern
            </Button>
          </div>
        </div>
      }
    >
      <div className="">
        {invoiceLine.id}
        {invoiceLine.text}
      </div>
    </ResponsiveDialog>
  ),
  300
)
