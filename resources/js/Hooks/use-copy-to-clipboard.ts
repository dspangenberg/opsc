/*
Source: https://github.com/kokonut-labs/kokonutui/blob/main/hooks/use-copy-to-clipboard.ts

MIT License

Copyright (c) 2024 kokonutUI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import * as React from 'react'

export function useCopyToClipboard({
  timeout = 2000,
  onCopy
}: {
  timeout?: number
  onCopy?: () => void
} = {}) {
  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard = (value: string) => {
    if (typeof window === 'undefined' || !navigator.clipboard.writeText) {
      console.error('Clipboard API nicht verfügbar')
      return
    }

    if (!value) return

    navigator.clipboard
      .writeText(value)
      .then(() => {
        setIsCopied(true)

        if (onCopy) {
          onCopy()
        }

        const timer = setTimeout(() => {
          setIsCopied(false)
        }, timeout)

        // Cleanup-Funktion zum Aufräumen, wenn die Komponente unmounted wird
        return () => clearTimeout(timer)
      })
      .catch(error => {
        console.error('Fehler beim Kopieren:', error)
        // Optional: Hier könntest du den Nutzer über den Fehler informieren
      })
  }

  return { isCopied, copyToClipboard }
}
