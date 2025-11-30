import React, { type ReactNode, useContext, useEffect, useMemo, useState } from 'react'

type InvoiceTableProviderProps = {
  children: ReactNode
}

type InvoiceTableContextType = {
  editMode: boolean
  lines: App.Data.InvoiceLineData[]
  amountNet: number
  amountTax: number
  amountGross: number
  setEditMode: (editMode: boolean) => void
  setLines: (lines: App.Data.InvoiceLineData[]) => void
  updateLine: (lineId: number, updates: Partial<App.Data.InvoiceLineData>) => void
}

const InvoiceTableContext = React.createContext<InvoiceTableContextType | undefined>(undefined)

export const InvoiceTableProvider = ({ children }: InvoiceTableProviderProps) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [lines, setLines] = useState<App.Data.InvoiceLineData[]>([])
  const [amountNet, setAmountNet] = useState<number>(0)
  const [amountTax, setAmountTax] = useState<number>(0)
  const [amountGross, setAmountGross] = useState<number>(0)

  const updateLine = (lineId: number, updates: Partial<App.Data.InvoiceLineData>) => {
    setLines(prevLines =>
      prevLines.map(line => (line.id === lineId ? { ...line, ...updates } : line))
    )
  }

  useEffect(() => {
    const amountNet = Math.round(lines.reduce((sum, line) => sum + (line.amount || 0), 0) * 100) / 100
    const amountTax = Math.round(lines.reduce(
      (sum, line) => sum + ((line.amount || 0) / 100) * (line.rate?.rate || 0),
      0
    ) * 100) / 100
    const amountGross = Math.round((amountNet + amountTax) * 100) / 100
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
      setEditMode,
      setLines,
      updateLine
    }),
    [editMode, amountNet, amountGross, amountTax, lines]
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
