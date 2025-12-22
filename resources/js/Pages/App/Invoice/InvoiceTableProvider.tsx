import React, { type ReactNode, useContext, useEffect, useMemo, useState } from 'react'

type InvoiceTableProviderProps = {
  children: ReactNode
}

type InvoiceTableContextType = {
  editMode: boolean
  lines: App.Data.InvoiceLineData[]
  linkedInvoices: App.Data.InvoiceLineData[]
  amountNet: number
  amountTax: number
  amountGross: number
  setEditMode: (editMode: boolean) => void
  setLines: (lines: App.Data.InvoiceLineData[]) => void
  setLinkedInvoices: (lines: App.Data.InvoiceLineData[]) => void
  updateLine: (lineId: number, updates: Partial<App.Data.InvoiceLineData>) => void
  setInvoice: (invoice: App.Data.InvoiceData) => void
  duplicateLine: (line: App.Data.InvoiceLineData) => void
  removeLine: (lineId: number | null) => void
  invoice: App.Data.InvoiceData
  addLine: (typeId: number) => void
}

const InvoiceTableContext = React.createContext<InvoiceTableContextType | undefined>(undefined)

export const InvoiceTableProvider = ({ children }: InvoiceTableProviderProps) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [lines, setLines] = useState<App.Data.InvoiceLineData[]>([])
  const [invoice, setInvoice] = useState<App.Data.InvoiceData>({} as App.Data.InvoiceData)
  const [linkedInvoices, setLinkedInvoices] = useState<App.Data.InvoiceLineData[]>([])
  const [amountNet, setAmountNet] = useState<number>(0)
  const [amountTax, setAmountTax] = useState<number>(0)
  const [amountGross, setAmountGross] = useState<number>(0)

  const updateLine = (lineId: number, updates: Partial<App.Data.InvoiceLineData>) => {
    setLines(prevLines =>
      prevLines.map(line =>
        line.id !== null && line.id === lineId ? { ...line, ...updates } : line
      )
    )
  }

  const getNewLineId = () => {
    const newLines = lines.filter(line => line.id !== null && line.id < 0)
    return newLines.length ? -1 * (newLines.length + 1) : -1
  }

  const addLine = (typeId: number) => {
    const newLine: App.Data.InvoiceLineData = {
      id: getNewLineId(),
      invoice_id: 0,
      type_id: typeId,
      pos: 0,
      tax_id: 0,
      quantity: [1, 2].includes(typeId) ? 1 : 0,
      unit: '',
      text: '',
      price: 0,
      amount: 0,
      tax: 0,
      tax_rate_id: invoice.tax?.default_rate_id || 0,
      rate: null,
      service_period_begin: '',
      service_period_end: '',
      linked_invoice: null
    }
    console.log(newLine)
    setLines(prevLines => [...prevLines, newLine])
  }

  const duplicateLine = (line: App.Data.InvoiceLineData) => {
    const newLines = lines.filter(line => line.id !== null && line.id < 0)
    const newId = newLines.length ? -1 * (newLines.length + 1) : -1

    const newLine = {
      ...line,
      id: newId,
      pos: lines.length
    }

    setLines(prevLines => [...prevLines, newLine])
  }

  const removeLine = (lineId: number | null) => {
    setLines(prevLines => prevLines.filter(line => line.id !== null && line.id !== lineId))
  }

  useEffect(() => {
    const amountNet =
      Math.round(lines.reduce((sum, line) => sum + (line.amount || 0), 0) * 100) / 100
    const amountTax =
      Math.round(
        lines.reduce((sum, line) => sum + ((line.amount || 0) / 100) * (line.rate?.rate || 0), 0) *
          100
      ) / 100
    const amountGross = Math.round((amountNet + amountTax) * 100) / 100
    const invoices = lines.filter(line => line.type_id === 9)
    setLinkedInvoices(invoices)
    setAmountNet(amountNet)
    setAmountTax(amountTax)
    setAmountGross(amountGross)
  }, [lines])

  const value = useMemo(
    () => ({
      editMode,
      amountNet,
      amountTax,
      amountGross,
      lines,
      linkedInvoices,
      removeLine,
      setInvoice,
      addLine,
      invoice,
      duplicateLine,
      setLinkedInvoices,
      setEditMode,
      setLines,
      updateLine
    }),
    [editMode, amountNet, amountGross, amountTax, lines, linkedInvoices, invoice]
  )

  return <InvoiceTableContext.Provider value={value}>{children}</InvoiceTableContext.Provider>
}

export const useInvoiceTable = (): InvoiceTableContextType => {
  const context = useContext(InvoiceTableContext)
  if (context === undefined) {
    throw new Error('useInvoiceTable must be used within an InvoiceTableProvider')
  }
  return context
}
