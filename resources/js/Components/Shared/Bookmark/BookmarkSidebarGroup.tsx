/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Edit04Icon,
  Folder01Icon,
  Folder02Icon,
  FolderAddIcon,
  MoreVerticalIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { usePage } from '@inertiajs/react'
import { ChevronDown } from 'lucide-react'
import type { FC } from 'react'
import { BookmarkEditDialog } from '@/Components/Shared/Bookmark/BookmarkEditDialog'
import { BookmarkSidebarGroupBookmarks } from '@/Components/Shared/Bookmark/BookmarkSidebarGroupBookmarks'
import { Button } from '@/Components/twc-ui/button'
import { DropdownButton, MenuItem } from '@/Components/twc-ui/dropdown-button'
import { Icon } from '@/Components/twc-ui/icon'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/Components/ui/sidebar'

const handleAddFolder = async () => {
  const result = await BookmarkEditDialog.call({
    title: 'Neuen Lesezeichenordner erstellen',
    buttonTitle: 'Ordner erstellen'
  })

  if (result === false) return

  const data = {
    name: result
  }
  router.post(route('app.bookmark.store-folder'), data, {
    preserveScroll: true,
    onError: errors => {
      console.log(errors)
    }
  })
}

const FolderItem: FC<{ folder: App.Data.BookmarkFolderData }> = ({ folder }) => {
  return (
    <Collapsible key={folder.id} defaultOpen className="group/folder mr-1 cursor-default">
      <SidebarMenuSubItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuSubButton className="ml-1.5 w-full">
            <div className="group/folder flex w-full items-center gap-1">
              <Icon
                icon={Folder01Icon}
                className="size-4 group-data-[state=closed]/folder:block group-data-[state=open]/folder:hidden"
              />
              <Icon
                icon={Folder02Icon}
                className="size-4 group-data-[state=open]/folder:block group-data-[state=closed]/folder:hidden"
              />
              <span className="flex-1 truncate">{folder.name}</span>
              <div className="pr-2">
                <DropdownButton
                  icon={MoreVerticalIcon}
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 pressed:opacity-100 group-hover/folder:opacity-100"
                >
                  <MenuItem icon={Edit04Icon} title="Ordner umbenennen" />
                </DropdownButton>
              </div>
            </div>
          </SidebarMenuSubButton>
        </CollapsibleTrigger>
      </SidebarMenuSubItem>
      <CollapsibleContent asChild>
        <div className="ml-6 border-l pl-2">
          <BookmarkSidebarGroupBookmarks bookmarks={folder.bookmarks} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export const BookmarkSidebarGroup: FC = () => {
  const { auth } = usePage().props
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="group/bookmarks">
        <SidebarGroupLabel asChild className="text-base group-hover/bookmarks:bg-sidebar-accent">
          <CollapsibleTrigger className="mr-0 pr-0 font-normal text-base!">
            <ChevronDown className="mr-2 size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
            Lesezeichen
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <SidebarGroupAction title="Ordner hinzufügen" asChild>
          <Button
            icon={FolderAddIcon}
            variant="ghost"
            size="icon-sm"
            className="opacity-0 group-hover/bookmarks:opacity-100"
            onPress={() => handleAddFolder()}
          />
        </SidebarGroupAction>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenuSub className="ml-3 block">
              {auth.bookmarkFolders.map(folder => (
                <FolderItem key={folder.id} folder={folder} />
              ))}
              <BookmarkSidebarGroupBookmarks bookmarks={auth.bookmarks} />
            </SidebarMenuSub>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}
