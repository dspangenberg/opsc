/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { InvoiceDetailsReleaseConfirm } from '@/Pages/App/Invoice/InvoiceDetailsReleaseConfirm'
import { ConfirmationDialog } from '@/Pages/App/Invoice/ConfirmationDialog'
import type * as React from 'react'

export const InvoiceDetailsReleaseConfirmRoot = InvoiceDetailsReleaseConfirm.Root
export const ConfirmationDialogRoot = ConfirmationDialog.Root

// Diese Komponente dient nur als Namespace und wird nicht gerendert
export const Confirmations = {
  InvoiceDetailsReleaseConfirm: InvoiceDetailsReleaseConfirmRoot,
  ConfirmationDialog: ConfirmationDialogRoot
}
