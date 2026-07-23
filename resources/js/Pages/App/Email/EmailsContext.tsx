import { createContext } from 'react'

export const EmailsContext = createContext<{
  selectedMails: number[]
  setSelectedMails: (documents: number[]) => void
}>({
  selectedMails: [],
  setSelectedMails: () => {}
})
