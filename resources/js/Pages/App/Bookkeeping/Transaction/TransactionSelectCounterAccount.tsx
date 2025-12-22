import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'

interface TransactionSelectCounterAccountComponentProps {
  accounts: App.Data.BookkeepingAccountData[]
  transaction?: App.Data.TransactionData
  onConfirm: (account: number) => void
  onCancel: () => void
}

const TransactionSelectCounterAccountComponent: React.FC<
  TransactionSelectCounterAccountComponentProps
> = ({ accounts, transaction, onConfirm, onCancel }) => {
  const [selectedAccount, setSelectedAccount] = useState<number>(
    transaction?.counter_account_id || 0
  )
  return (
    <Dialog
      isOpen={true}
      onClose={() => {
        setTimeout(() => {
          onCancel()
        }, 50)
      }}
      className="z-100 bg-white"
      confirmClose={false}
      width="lg"
      bodyPadding
      isDismissible={true}
      title="Gegenkonto auswählen"
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
                onConfirm(selectedAccount)
              }, 50)
            }}
          >
            Konto auswählen
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <FormGrid>
          <div className="col-span-24">
            <FormComboBox<App.Data.BookkeepingAccountData>
              className="my-3 flex-1 bg-background"
              autoFocus
              name="view"
              label="Gegenkonto"
              value={selectedAccount}
              onChange={value =>
                setSelectedAccount(typeof value === 'number' ? value : Number(value) || 0)
              }
              items={accounts}
              itemName="label"
              itemValue="account_number"
            />
          </div>
        </FormGrid>
      </div>
    </Dialog>
  )
}

interface TransactionSelectCounterAccountDialogCallParams {
  accounts: App.Data.BookkeepingAccountData[]
  transaction: App.Data.TransactionData
}

export const TransactionSelectCounterAccountDialog = {
  call: (params: TransactionSelectCounterAccountDialogCallParams): Promise<number | false> => {
    return new Promise<number | false>(resolve => {
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
        <TransactionSelectCounterAccountComponent
          {...params}
          onConfirm={(account: number) => {
            cleanup()
            resolve(account)
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
