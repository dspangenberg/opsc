import { ArrowDataTransferHorizontalIcon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/Components/twc-ui/button'
import { ExtendedDialog as Dialog } from '@/Components/twc-ui/extended-dialog'
import { FormComboBox } from '@/Components/twc-ui/form-combo-box'
import { FormGrid } from '@/Components/twc-ui/form-grid'

interface Accounts {
  account_id_credit: number
  account_id_debit: number
}
interface BookingEditAccountsComponentProps {
  accounts: App.Data.BookkeepingAccountData[]
  booking: App.Data.BookkeepingBookingData
  onConfirm: (accounts: Accounts) => void
  onCancel: () => void
}

const BookingEditAccountsComponent: React.FC<BookingEditAccountsComponentProps> = ({
  accounts,
  booking,
  onConfirm,
  onCancel
}) => {
  const [selectedCreditAccount, setSelectedCreditAccount] = useState<number>(
    booking.account_id_credit
  )
  const [selectedDebitAccount, setSelectedDebitAccount] = useState<number>(booking.account_id_debit)

  const handleAccountTransfer = () => {
    const accountCredit = selectedCreditAccount
    setSelectedCreditAccount(selectedDebitAccount)
    setSelectedDebitAccount(accountCredit)
  }

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
                onConfirm({
                  account_id_credit: selectedCreditAccount,
                  account_id_debit: selectedDebitAccount
                })
              }, 50)
            }}
          >
            Konten auswählen
          </Button>
        </div>
      }
    >
      <div className="flex w-full flex-1 rounded-t-lg">
        <FormGrid>
          <div className="col-span-22">
            <FormComboBox<App.Data.BookkeepingAccountData>
              className="my-3 flex-1 bg-background"
              autoFocus
              name="view"
              label="Habenkonto"
              value={selectedCreditAccount}
              onChange={value =>
                setSelectedCreditAccount(typeof value === 'number' ? value : Number(value) || 0)
              }
              items={accounts}
              itemName="label"
              itemValue="account_number"
            />
          </div>
          <Button
            variant="outline"
            icon={ArrowDataTransferHorizontalIcon}
            onClick={handleAccountTransfer}
          />
          <div className="col-span-22">
            <FormComboBox<App.Data.BookkeepingAccountData>
              className="my-3 flex-1 bg-background"
              autoFocus
              name="view"
              items={accounts}
              itemName="label"
              itemValue="account_number"
              label="Sollkonto"
              value={selectedDebitAccount}
              onChange={value =>
                setSelectedDebitAccount(typeof value === 'number' ? value : Number(value) || 0)
              }
            />
          </div>
        </FormGrid>
      </div>
    </Dialog>
  )
}

interface BookingEditAccountsComponentCallParams {
  accounts: App.Data.BookkeepingAccountData[]
  booking: App.Data.BookkeepingBookingData
}

export const BookingEditAccounts = {
  call: (params: BookingEditAccountsComponentCallParams): Promise<Accounts | false> => {
    return new Promise<Accounts | false>(resolve => {
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
        <BookingEditAccountsComponent
          {...params}
          onConfirm={(accounts: Accounts) => {
            cleanup()
            resolve(accounts)
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
