import { MultiplicationSignIcon } from '@hugeicons/core-free-icons'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-aria-components'
import { Avatar } from './avatar'
import { Button } from './button'
import { FileTrigger } from './file-trigger'

interface Props {
  avatarUrl: string | null
  fullName: string
  initials?: string
  onChanged: (avatar: File | undefined) => void
}

export const AvatarUpload: React.FC<Props> = ({ avatarUrl, fullName, initials, onChanged }) => {
  const [droppedImage, setDroppedImage] = useState<string | undefined>(
    avatarUrl as string | undefined
  )

  useEffect(() => {
    return () => {
      if (droppedImage) {
        URL.revokeObjectURL(droppedImage)
      }
    }
  }, [droppedImage])

  async function onSelectHandler(e: FileList | null) {
    if (!e || e.length === 0) return

    try {
      const item = e[0]

      if (item) {
        if (droppedImage?.startsWith('blob:')) {
          URL.revokeObjectURL(droppedImage)
        }

        setDroppedImage(URL.createObjectURL(item))
      }
      onChanged(item)
    } catch (error) {
      console.error('Fehler beim Verarbeiten des Bildes:', error)
    }
  }

  const removeAvatar = () => {
    setDroppedImage(undefined)
    onChanged(undefined)
  }

  return (
    <div className="relative">
      <FileTrigger
        acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
        onSelect={onSelectHandler}
      >
        <Pressable>
          <Avatar
            role="button"
            fullname={fullName}
            src={droppedImage}
            size="lg"
            initials={initials}
            className="cursor-pointer"
            aria-label="Avatar ändern"
          />
        </Pressable>
      </FileTrigger>
      <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2 border-white">
        <Button
          variant="outline"
          size="icon-xs"
          className="size-4 rounded-full"
          iconClassName="size-3"
          icon={MultiplicationSignIcon}
          onClick={removeAvatar}
        />
      </div>
    </div>
  )
}
