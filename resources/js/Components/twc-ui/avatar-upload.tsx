import type * as React from 'react'
import { useEffect, useState } from 'react'
import { Pressable } from 'react-aria-components'
import { Avatar } from './avatar'
import { FileTrigger } from './file-trigger'

interface Props {
  avatarUrl: string | null
  fullName: string
  onChanged: (avatar: File) => void
}

export const AvatarUpload: React.FC<Props> = ({ avatarUrl, fullName, onChanged }) => {
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
        onChanged(item)
      }
    } catch (error) {
      console.error('Fehler beim Verarbeiten des Bildes:', error)
    }
  }

  return (
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
          className="cursor-pointer"
          aria-label="Avatar ändern"
        />
      </Pressable>
    </FileTrigger>
  )
}
