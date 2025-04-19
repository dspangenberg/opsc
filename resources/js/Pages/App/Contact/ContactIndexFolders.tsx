import type * as React from 'react'
import { ViewNavigation, type ViewNavigationFolderProps } from '@/Components/ViewNavigation'

export const ContactIndexFolders: React.FC = () => {
  const defaultViews: ViewNavigationFolderProps[] = [
    {
      title: 'Alle Kontakte',
      counter: 92,
      name: 'view-contacts-all',
      route: '/contact'
    },
    {
      title: 'Meine Favoriten',
      counter: 17,
      name: 'view-contacts-favorites',
      route: '/contact'
    }
  ]

  const customViews: ViewNavigationFolderProps[] = [
    {
      title: 'Debitoren',
      counter: 11,
      route: '/contact',
      name: 'view-contacts-debtors'
    },
    {
      title: 'Kreditoren',
      counter: 74,
      route: '/contact',
      name: 'view-contacts-creditors'
    },
    {
      title: 'Archivierte Kontakte + Arschlöcher',
      counter: 6,
      route: '/contact',
      name: 'view-contacts-archived'
    }
  ]

  return (
    <div className="w-54 flex-none mt-6">
      <ViewNavigation
        activeView="view-contacts-all"
        title="Kontakte"
        defaultViews={defaultViews}
        customViews={customViews}
      />
    </div>
  )
}
