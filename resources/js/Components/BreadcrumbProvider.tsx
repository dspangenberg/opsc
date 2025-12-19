import React, { type ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import type { BreadcrumbProp } from '@/Components/PageBreadcrumbs'

const createContext = React.createContext

type BreadcrumbProviderProps = {
  children: ReactNode
}

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbProp[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbProp[]) => void
  addBreadcrumb: (breadcrumb: BreadcrumbProp) => void
  removeBreadcrumb: (index: number) => void
  clearBreadcrumbs: () => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined)

export const BreadcrumbProvider = ({ children }: BreadcrumbProviderProps) => {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbProp[]>([])

  const addBreadcrumb = useCallback((breadcrumb: BreadcrumbProp) => {
    setBreadcrumbs(prev => [...prev, breadcrumb])
  }, [])

  const removeBreadcrumb = useCallback((index: number) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearBreadcrumbs = useCallback(() => {
    setBreadcrumbs([])
  }, [])

  const value = useMemo(
    () => ({
      breadcrumbs,
      setBreadcrumbs,
      addBreadcrumb,
      removeBreadcrumb,
      clearBreadcrumbs
    }),
    [breadcrumbs, addBreadcrumb, removeBreadcrumb, clearBreadcrumbs]
  )

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

export const useBreadcrumb = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext)
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
  }
  return context
}
