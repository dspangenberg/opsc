import type { DateValue } from '@internationalized/date'
import type { RangeValue } from '@react-types/shared'
import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { Checkbox } from '@/Components/twc-ui/checkbox'
import { DateRangePicker } from '@/Components/twc-ui/date-range-picker'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { FormGrid } from '@/Components/twc-ui/form-grid'

interface InvoiceReportDialogComponentProps {
  defaultRange: RangeValue<DateValue> | null
  onConfirm: (dateRange: RangeValue<DateValue> | null, withPayments: boolean) => void
  onCancel: () => void
}

export interface InvoiceReportResult {
  range: RangeValue<DateValue> | null
  withPayments: boolean
}

const InvoiceReportDialogComponent: React.FC<InvoiceReportDialogComponentProps> = ({
  defaultRange,
  onCancel,
  onConfirm
}) => {
  const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(defaultRange)
  const [withPayments, setWithPayments] = useState(false)
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
            disabled={!dateRange?.start || !dateRange?.end}
            onClick={() => {
              setTimeout(() => {
                onConfirm(dateRange, withPayments)
              }, 50)
            }}
          >
            Bericht erstellen
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <FormGrid>
          <div className="col-span-14">
            <DateRangePicker
              autoFocus
              label="Auswertungszeitraum"
              value={dateRange}
              onChange={value => setDateRange(value)}
            />
            <div className="pt-1.5">
              <Checkbox
                name="with-payments"
                label="mit Zahlungen"
                checked={withPayments}
                onChange={setWithPayments}
              />
            </div>
          </div>
        </FormGrid>
      </div>
    </Dialog>
  )
}

export const InvoiceReportDialog = {
  call: (
    params: { defaultRange: RangeValue<DateValue> | null } = {
      defaultRange: null
    }
  ): Promise<InvoiceReportResult | false> => {
    return new Promise<InvoiceReportResult | false>(resolve => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      let cleaned = false
      const cleanup = () => {
        if (cleaned) return
        cleaned = true
        root.unmount()
        if (container.parentNode) {
          container.parentNode.removeChild(container)
        }
      }

      const timeoutId = window.setTimeout(() => {
        cleanup()
        resolve(false)
      }, 500000)

      root.render(
        <InvoiceReportDialogComponent
          {...params}
          onConfirm={(range: RangeValue<DateValue> | null, withPayments: boolean) => {
            clearTimeout(timeoutId)
            cleanup()
            resolve({ range, withPayments })
          }}
          onCancel={() => {
            clearTimeout(timeoutId)
            cleanup()
            resolve(false)
          }}
        />
      )
    })
  },

  Root: () => null
}
