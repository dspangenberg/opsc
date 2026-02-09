import type { DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { DateRangePicker } from '@/Components/twc-ui/date-range-picker'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'

interface ReceiptReportDialogComponentProps {
  onConfirm: (dateRange: RangeValue<DateValue> | null) => void
  onCancel: () => void
}

const ReceiptReportDialogComponent: React.FC<ReceiptReportDialogComponentProps> = ({
  onCancel,
  onConfirm
}) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)
  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100 bg-background"
      confirmClose={false}
      width="lg"
      bodyPadding
      isDismissible={true}
      title="Bericht erstellen"
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              setTimeout(() => {
                onCancel()
              }, 50)
            }}
          >
            Abbrechen
          </Button>

          <Button
            variant="default"
            onClick={() => {
              setTimeout(() => {
                onConfirm(dateRange)
              }, 50)
            }}
          >
            Bericht erstellen
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <DateRangePicker
          autoFocus
          label="Zeitraum"
          value={dateRange}
          onChange={value => setDateRange(value)}
        />
      </div>
    </Dialog>
  )
}

export const ReceiptReportDialog = {
  call: (): Promise<RangeValue<DateValue> | false> => {
    return new Promise<RangeValue<DateValue> | false>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const cleanup = () => {
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      root.render(
        <ReceiptReportDialogComponent
          onConfirm={(range: RangeValue<DateValue> | null) => {
            cleanup()
            resolve(range ?? false)
          }}
          onCancel={() => {
            cleanup()
            resolve(false)
          }}
        />
      )

      setTimeout(() => {
        cleanup()
        resolve(false)
      }, 500000)
    })
  },

  Root: () => null
}
