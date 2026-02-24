import {
  Add01Icon,
  Bookmark01Icon,
  CopyLinkIcon,
  Delete02Icon,
  Edit02Icon,
  Folder01Icon,
  FolderFavouriteIcon,
  MoreVerticalIcon,
  PinIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/core'
import { usePage } from '@inertiajs/react'
import type * as React from 'react'
import { useState } from 'react'
import { MenuItem as AriaMenuItem } from 'react-aria-components'
import { BookmarkEditDialog } from '@/Components/Shared/Bookmark/BookmarkEditDialog'
import { Button } from '@/Components/twc-ui/button'
import { Icon, type IconType } from '@/Components/twc-ui/icon'
import {
  Menu,
  MenuItem,
  MenuPopover,
  MenuSeparator,
  MenuSubTrigger,
  MenuTrigger
} from '@/Components/twc-ui/menu'
import { toast } from '@/Components/twc-ui/sonner'
import { useCopyToClipboard } from '@/Hooks/use-copy-to-clipboard'

interface Props {
  bookmarks: App.Data.BookmarkData[]
  icon?: IconType
  model: string
  onUpdate: () => void
}

export const BookmarkMenu: React.FC<Props> = ({ model, bookmarks, icon, onUpdate }: Props) => {
  const folders = usePage().props.auth.bookmarkFolders as App.Data.BookmarkFolderData[]
  const realIcon = icon ? icon : Bookmark01Icon

  const [_isOpen, setIsOpen] = useState(false)
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { copyToClipboard } = useCopyToClipboard()
  const handleCreateBookmark = async () => {
    const result = await BookmarkEditDialog.call({ title: 'Neues Lesezeichen erstellen' })
    if (result !== false) {
      const currentRouteName = route().current()
      if (!currentRouteName) return
      const data = {
        name: result,
        model: model,
        is_pinned: false,
        route_name: currentRouteName,
        route_params: route().params
      }
      router.post(route('app.bookmark.store'), data, {
        preserveScroll: true,
        onSuccess: () => {
          onUpdate()
        },
        onError: errors => {
          console.log(errors)
        }
      })
    }
  }

  const handleRename = async (bookmark: App.Data.BookmarkData) => {
    setActiveMenuId(null)
    setIsOpen(false)
    setDropdownOpen(false)
    const result = await BookmarkEditDialog.call({
      name: bookmark.name,
      title: 'Lesezeichen umbenennen',
      buttonTitle: 'Speichern'
    })
    if (result !== false) {
      router.put(
        route('app.bookmark.rename', { bookmark: bookmark.id }),
        {
          name: result
        },
        {
          preserveScroll: true,
          onSuccess: () => {
            onUpdate()
          },
          onError: errors => {
            console.log(errors)
          }
        }
      )
    }
  }

  const handlePin = (bookmark: App.Data.BookmarkData, folderId?: number) => {
    setDropdownOpen(false)
    router.put(
      route('app.bookmark.toggle-pin', { bookmark: bookmark.id }),
      { is_pinned: true, bookmark_folder_id: folderId || null },
      { preserveScroll: true, onSuccess: () => onUpdate() }
    )
  }

  const handleCopyLink = (bookmark: App.Data.BookmarkData) => {
    setIsOpen(false)
    copyToClipboard(route(bookmark.route_name, bookmark.route_params, true))
  }

  const handleRestore = (bookmark: App.Data.BookmarkData) => {
    router.put(
      route('app.bookmark.restore', { bookmark: bookmark.id }),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          onUpdate()
          toast(`Lesezeichen ${bookmark.title} wurde wiederhergestellt`, 'success')
        }
      }
    )
  }

  const handleTrash = (bookmark: App.Data.BookmarkData) => {
    setDropdownOpen(false)
    router.delete(route('app.bookmark.trash', { bookmark: bookmark.id }), {
      onSuccess: () => {
        onUpdate()
        toast({
          type: 'info',
          message: `Lesezeichen ${bookmark.title} wurde gelöscht`,
          button: {
            onClick: () => handleRestore(bookmark),
            label: 'Undo'
          }
        })
      }
    })
  }

  return (
    <MenuTrigger isOpen={dropdownOpen} onOpenChange={setDropdownOpen}>
      <Button variant="toolbar" icon={Bookmark01Icon} title="Lesezeichen" />
      <MenuPopover className="min-w-[--trigger-width]">
        <Menu>
          {bookmarks.length > 0 &&
            bookmarks.map(bookmark => (
              <AriaMenuItem
                key={bookmark.id}
                textValue={bookmark.name}
                className="group relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-disabled:pointer-events-none data-focused:bg-accent data-focused:text-accent-foreground data-disabled:opacity-50"
                href={route(bookmark.route_name, bookmark.route_params)}
              >
                {icon ? (
                  <Icon icon={realIcon} className="size-4 flex-none" />
                ) : (
                  <span className="size-4" />
                )}
                <span className="flex-1 truncate">{bookmark.title}</span>

                <MenuTrigger
                  isOpen={activeMenuId === bookmark.id}
                  onOpenChange={open => {
                    setActiveMenuId(open ? bookmark.id : null)
                    if (!open) setIsOpen(false)
                  }}
                >
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="ml-4 p-0 opacity-0 pressed:opacity-100 group-hover:opacity-100"
                    iconClassName="size-4"
                    icon={MoreVerticalIcon}
                    onPress={() => {
                      setActiveMenuId(activeMenuId === bookmark.id ? null : bookmark.id)
                      setIsOpen(activeMenuId !== bookmark.id)
                    }}
                  />
                  <MenuPopover>
                    <Menu>
                      <MenuItem
                        icon={PinIcon}
                        title="In Sidebar anheften"
                        onAction={() => handlePin(bookmark)}
                      />
                      <MenuSubTrigger>
                        <MenuItem
                          icon={FolderFavouriteIcon}
                          isDisabled={!folders.length}
                          separator
                          title="In Ordner anheften"
                        />
                        <MenuPopover>
                          <Menu>
                            {folders.map(folder => (
                              <MenuItem
                                key={folder.id}
                                icon={Folder01Icon}
                                title={`${folder.name}`}
                                onAction={() => handlePin(bookmark, folder.id)}
                              />
                            ))}
                          </Menu>
                        </MenuPopover>
                      </MenuSubTrigger>

                      <MenuItem
                        ellipsis
                        icon={Edit02Icon}
                        title="Umbenennen"
                        onAction={() => handleRename(bookmark)}
                      />
                      <MenuItem
                        icon={CopyLinkIcon}
                        separator
                        title="URL in Zwischenablage kopieren"
                        onAction={() => handleCopyLink(bookmark)}
                      />
                      <MenuItem
                        icon={Delete02Icon}
                        title="Löschen"
                        variant="destructive"
                        onAction={() => handleTrash(bookmark)}
                      />
                    </Menu>
                  </MenuPopover>
                </MenuTrigger>
              </AriaMenuItem>
            ))}

          {bookmarks.length > 0 && <MenuSeparator />}

          <MenuItem
            icon={Add01Icon}
            title="Lesezeichen erstellen"
            onAction={handleCreateBookmark}
          />
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
