/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { cn } from '@/Lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import type React from 'react'
import type { ReactNode } from 'react'
import { Badge } from '@/Components/ui/badge'

type ReactNodeOrString = ReactNode | string

export interface ViewNavigationFolderProps {
  title: string
  counter: number
  name: string
  route: string
  isActive?: boolean
}
interface ViewNavigationProps {
  customViewsTitle?: string
  title?: string
  activeView: string
  defaultViews?: ViewNavigationFolderProps[]
  customViews?: ViewNavigationFolderProps[]
  className?: string
}

interface FolderHeaderProps {
  children: ReactNode
}

export const ViewNavigation: React.FC<ViewNavigationProps> = ({
  customViewsTitle = 'Gepseicherte Views',
  className,
  title = 'Standardviews',
  activeView,
  defaultViews = [],
  customViews = []
}) => {
  return (
    <div className={cn('flex flex-col py-2 space-y-4 my-3 flex-1', className)}>
      {defaultViews.length > 0 && (
        <div>
          <FolderHeader>{title}</FolderHeader>
          {defaultViews.map(view => (
            <Folder
              key={view.name}
              isActive={activeView === view.name}
              name={view.name}
              title={view.title}
              counter={view.counter}
              route={view.route}
            />
          ))}
        </div>
      )}

      {customViews.length > 0 && (
        <div>
          <FolderHeader>{customViewsTitle}</FolderHeader>
          {customViews.map(view => (
            <Folder
              key={view.name}
              name={view.name}
              title={view.title}
              isActive={activeView === view.name}
              counter={view.counter}
              route={view.route}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const FolderHeader: React.FC<FolderHeaderProps> = ({ children }: FolderHeaderProps) => {
  return <div className="text-xs font-medium text-foreground/50 px-3">{children}</div>
}

export const Folder: React.FC<ViewNavigationFolderProps> = ({
  title,
  isActive = false,
  counter,
  name,
  route
}: ViewNavigationFolderProps) => {
  return (
    <li
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        'flex items-center leading-relaxed gap-2 text-sm text-foreground rounded-md px-3 py-1.5',
        'data-[state=active]:font-medium data-[state=active]:bg-sidebar-accent'
      )}
    >
      <div className="flex-1 truncate">{title}</div>
      {counter > 0 && (
        <span className="text-sidebar-foreground/50 align-items-end text-right text-xs ml-2">
          <Badge variant="outline" className="font-normal">
            {counter}
          </Badge>
        </span>
      )}
    </li>
  )
}
