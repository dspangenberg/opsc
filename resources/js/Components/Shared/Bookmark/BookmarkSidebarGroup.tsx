/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import {
  Delete02Icon,
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
import { toast } from '@/Components/twc-ui/sonner'
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
import { useLocalStorage } from '@/Hooks/use-local-storage'

const FolderItem: FC<{ folder: App.Data.BookmarkFolderData }> = ({ folder }) => {
  const [value, setValue] = useLocalStorage<number[]>('open-folders', [])

  const isOpen = value.includes(folder.id)
  const handleFolderOpenChange = (open: boolean) => {
    if (open) {
      setValue([...value, folder.id])
    } else {
      setValue(value.filter(id => id !== folder.id))
    }
  }

  const handleRename = async (folder: App.Data.BookmarkFolderData) => {
    console.log(folder)
    const result = await BookmarkEditDialog.call({
      name: folder.name,
      title: 'Ordner umbenennen',
      buttonTitle: 'Speichern'
    })
    if (result !== false) {
      router.put(route('app.bookmark.rename-folder', { bookmarkFolder: folder.id }), {
        name: result
      })
    }
  }

  const handleTrash = (folder: App.Data.BookmarkFolderData) => {
    router.delete(route('app.bookmark.trash-folder', { bookmarkFolder: folder.id }), {
      onSuccess: () => {
        toast({
          type: 'info',
          message: `Lesezeichen-Ordner ${folder.name} wurde gelöscht`,
          button: {
            onClick: () => handleRestore(folder),
            label: 'Undo'
          }
        })
      }
    })
  }

  const handleRestore = (folder: App.Data.BookmarkFolderData) => {
    router.put(
      route('app.bookmark.restore-folder', { bookmarkFolder: folder.id }),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast(`Lesezeichen-Ordner ${folder.name} wurde wiederhergestellt`, 'success')
        }
      }
    )
  }

  return (
    <Collapsible
      key={folder.id}
      open={isOpen}
      onOpenChange={handleFolderOpenChange}
      className="group/folder mr-1 cursor-default"
    >
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
                  <MenuItem
                    icon={Edit04Icon}
                    title="Ordner umbenennen"
                    separator
                    onAction={() => handleRename(folder)}
                  />
                  <MenuItem
                    icon={Delete02Icon}
                    title="Ordner löschen"
                    variant="destructive"
                    isDisabled={folder.bookmarks.length > 0}
                    onAction={() => handleTrash(folder)}
                  />
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
  const [value, setValue] = useLocalStorage<boolean>('bookmarks-open', true)
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

  return (
    <Collapsible open={value} onOpenChange={value => setValue(value)} className="group/collapsible">
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
