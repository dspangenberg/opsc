/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { Bookmark01Icon, File02Icon, Invoice01Icon, PinOffIcon } from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { Link } from '@inertiajs/react'
import type * as React from 'react'
import type { FC } from 'react'
import { Button } from '@/Components/twc-ui/button'
import { Icon } from '@/Components/twc-ui/icon'

import { SidebarMenuSubButton, SidebarMenuSubItem } from '@/Components/ui/sidebar'

interface Props {
  bookmarks: App.Data.BookmarkData[]
}

export const BookmarkSidebarGroupBookmarks: FC<Props> = ({ bookmarks }) => {
  const handleUnpin = (bookmark: App.Data.BookmarkData) => {
    router.put(route('app.bookmark.toggle-pin', { bookmark: bookmark.id }), {
      is_pinned: false,
      bookmark_folder_id: null
    })
  }

  const getIcon = (bookmark: App.Data.BookmarkData) => {
    const model = bookmark.model.replaceAll('\\', '')
    switch (model) {
      case 'AppModelsReceipt':
        return Invoice01Icon
      case 'AppModelsDocument':
        return File02Icon
      default:
        return Bookmark01Icon
    }
  }

  return (
    <>
      {bookmarks.map(bookmark => (
        <SidebarMenuSubItem key={bookmark.name} className="hover:bg-sidebar-accent">
          <SidebarMenuSubButton asChild className="">
            <div className="group/bookmark flex items-center">
              <Icon icon={getIcon(bookmark)} className="size-4! shrink" />
              <Link
                href={route(bookmark.route_name, bookmark.route_params)}
                className="flex-1 truncate"
              >
                {bookmark.sidebar_title}
              </Link>
              <Button
                icon={PinOffIcon}
                variant="ghost"
                size="icon-sm"
                title="Loslösen!"
                className="mr-2.5 opacity-0 group-hover/bookmark:opacity-100"
                onPress={() => handleUnpin(bookmark)}
              />
            </div>
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      ))}
    </>
  )
}
