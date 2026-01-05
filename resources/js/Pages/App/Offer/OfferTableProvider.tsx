import React, { type ReactNode, useContext, useEffect, useMemo, useState } from 'react'

type OfferTableProviderProps = {
  children: ReactNode
}

type OfferTableContextType = {
  editMode: boolean
  lines: App.Data.OfferLineData[]
  amountNet: number
  amountTax: number
  amountGross: number
  setEditMode: (editMode: boolean) => void
  setLines: (lines: App.Data.OfferLineData[]) => void
  updateLine: (lineId: number, updates: Partial<App.Data.OfferLineData>) => void
  setOffer: (offer: App.Data.OfferData) => void
  duplicateLine: (line: App.Data.OfferLineData) => void
  removeLine: (lineId: number | null) => void
  offer: App.Data.OfferData
  addLine: (typeId: number) => void
}

const OfferTableContext = React.createContext<OfferTableContextType | undefined>(undefined)

export const OfferTableProvider = ({ children }: OfferTableProviderProps) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [lines, setLines] = useState<App.Data.OfferLineData[]>([])
  const [offer, setOffer] = useState<App.Data.OfferData>({} as App.Data.OfferData)
  const [amountNet, setAmountNet] = useState<number>(0)
  const [amountTax, setAmountTax] = useState<number>(0)
  const [amountGross, setAmountGross] = useState<number>(0)

  const updateLine = (lineId: number, updates: Partial<App.Data.OfferLineData>) => {
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
    const newLine: App.Data.OfferLineData = {
      id: getNewLineId(),
      offer_id: 0,
      type_id: typeId,
      pos: 0,
      tax_id: 0,
      quantity: [1, 3].includes(typeId) ? 1 : 0,
      unit: '',
      text: '',
      price: 0,
      amount: 0,
      tax: 0,
      tax_rate_id: offer.tax?.default_rate_id || 0,
      rate: null
    }
    setLines(prevLines => [...prevLines, newLine])
  }

  const duplicateLine = (line: App.Data.OfferLineData) => {
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
      removeLine,
      setOffer,
      addLine,
      offer,
      duplicateLine,
      setEditMode,
      setLines,
      updateLine
    }),
    [editMode, amountNet, amountGross, amountTax, lines, offer]
  )

  return <OfferTableContext.Provider value={value}>{children}</OfferTableContext.Provider>
}

export const useOfferTable = (): OfferTableContextType => {
  const context = useContext(OfferTableContext)
  if (context === undefined) {
    throw new Error('useOfferTable must be used within an OfferTableProvider')
  }
  return context
}
