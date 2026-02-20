import { createContext } from 'react'

export const DocumentIndexContext = createContext<{
  selectedDocuments: number[]
  setSelectedDocuments: (documents: number[]) => void
}>({
  selectedDocuments: [],
  setSelectedDocuments: () => {}
})
