import { router, useForm } from '@inertiajs/react'
import axios from 'axios'
import type * as React from 'react'
import { type FormEvent, useState } from 'react'
import { Button } from '@/Components/ui/twc-ui/button'
import { Dialog } from '@/Components/ui/twc-ui/dialog'

interface Props {
  isOpen: boolean
  bank_account: App.Data.BankAccountData
  onClosed: () => void
}

// Helper function to get cookie value
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

// Helper function to get CSRF token from various sources
const getCSRFToken = (): string | null => {
  // 1. Try meta tag first
  const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  if (metaToken) return metaToken

  // 2. Try cookies (common Laravel cookie names)
  const cookieToken =
    getCookie('XSRF-TOKEN') || getCookie('laravel_token') || getCookie('csrf_token')
  if (cookieToken) {
    // XSRF-TOKEN is usually URL-encoded
    try {
      return decodeURIComponent(cookieToken)
    } catch {
      return cookieToken
    }
  }

  // 3. Try localStorage/sessionStorage
  const storageToken = localStorage.getItem('csrf_token') || sessionStorage.getItem('csrf_token')
  if (storageToken) return storageToken

  return null
}

export const TransactionMoneyMoneyImport: React.FC<Props> = ({
  isOpen,
  bank_account,
  onClosed
}) => {
  const { data, setData, post, progress, processing, errors, clearErrors } = useForm({
    bank_account_id: bank_account.id,
    file: null as File | null
  })

  const handleOnClosed = () => {
    onClosed()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!data.file) {
      alert('Bitte wählen Sie eine Datei aus.')
      return
    }

    console.log('Submitting with Inertia.js...')
    console.log('File:', data.file.name, data.file.size, 'bytes')
    console.log('Bank Account ID:', data.bank_account_id)

    // Verwende Inertia.js - handhabt CSRF automatisch korrekt
    post(route('app.bookkeeping.transactions.money-money-import'), {
      forceFormData: true,
      onBefore: () => {
        console.log('Starting upload...')
      },
      onStart: () => {
        console.log('Upload started')
      },
      onSuccess: response => {
        console.log('Upload successful:', response)
        alert('Import erfolgreich abgeschlossen!')
        handleOnClosed()
      },
      onError: errors => {
        console.error('Upload errors:', errors)
        alert('Fehler: ' + JSON.stringify(errors))
      },
      onProgress: progress => {
        console.log('Upload progress:', progress)
      }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type)

      // Überprüfe Dateigröße (50MB Limit)
      if (file.size > 50 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximum sind 50MB erlaubt.')
        return
      }

      // Überprüfe Dateityp
      if (!file.type.includes('json') && !file.name.endsWith('.json')) {
        alert('Bitte wählen Sie eine JSON-Datei aus.')
        return
      }
    }

    clearErrors('file')
    setData('file', file)
  }

  return (
    <Dialog
      isOpen={isOpen}
      title="MoneyMoney JSON-Datei importieren"
      onClosed={handleOnClosed}
      footer={renderProps => (
        <>
          <Button id="dialog-cancel-button" variant="outline" onClick={() => renderProps.close()}>
            Abbrechen
          </Button>
          <Button isLoading={processing} form="import-form" type="submit" disabled={!data.file}>
            Datei importieren
          </Button>
        </>
      )}
    >
      <form id="import-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="file-input" className="mb-2 block font-medium text-gray-700 text-sm">
              JSON-Datei auswählen:
            </label>
            <input
              id="file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="block w-full text-gray-500 text-sm file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-blue-700 file:text-sm hover:file:bg-blue-100"
            />
            {errors.file && <p className="mt-1 text-red-600 text-sm">{errors.file}</p>}
            {data.file && (
              <p className="mt-1 text-green-600 text-sm">
                Datei ausgewählt: {data.file.name} ({Math.round(data.file.size / 1024)}KB)
              </p>
            )}
          </div>

          {progress && (
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
              <p className="mt-1 text-gray-600 text-sm">{progress.percentage}% hochgeladen</p>
            </div>
          )}
        </div>
      </form>
    </Dialog>
  )
}
