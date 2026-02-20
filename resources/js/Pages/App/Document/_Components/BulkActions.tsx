import {
  CheckListIcon,
  Delete01Icon,
  Delete04Icon,
  DeletePutBackIcon,
  FileEditIcon
} from '@hugeicons/core-free-icons'
import { router } from '@inertiajs/react'
import type React from 'react'
import { useContext } from 'react'
import { AlertDialog } from '@/Components/twc-ui/alert-dialog'
import { Button } from '@/Components/twc-ui/button'
import { Menu, MenuItem, MenuPopover, MenuTrigger } from '@/Components/twc-ui/menu'
import { Badge } from '@/Components/ui/badge'
import { DocumentIndexContext } from '@/Pages/App/Document/DocumentIndexContext'

interface BulkActionsProps {
  trash: boolean
}
export const BulkActions: React.FC<BulkActionsProps> = ({ trash }) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(DocumentIndexContext)

  if (!selectedDocuments.length) return null
  const handleForceDelete = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente endgültig löschen',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich endgültig löschen?`,
      buttonTitle: 'Endgültig löschen'
    })
    if (promise) {
      router.delete(
        route('app.document.bulk-force-delete', {
          _query: {
            document_ids: selectedDocuments.join(',')
          }
        })
      )
    }
  }

  const handleBulkRestore = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente wiederherstellen',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich wiederherstellen?`,
      buttonTitle: 'Dokumente wiederherstellen'
    })
    if (promise) {
      router.put(
        route('app.document.bulk-restore'),
        { ids: selectedDocuments.join(',') },
        {
          // onSuccess: () => setSelectedDocuments([])
        }
      )
    }
  }

  const handleBulkMoveToTrash = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente in den Papierkorb verschieben',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich in den Papierkorb verschieben?`,
      buttonTitle: 'In den Papierkorb verschieben'
    })
    if (promise) {
      router.put(
        route('app.document.bulk-move-to-trash'),
        { ids: selectedDocuments.join(',') },
        {
          onSuccess: () => setSelectedDocuments([])
        }
      )
    }
  }

  return (
    <MenuTrigger>
      <Button variant="outline" icon={CheckListIcon}>
        <div className="items-center">
          <Badge className="font-normal" variant="secondary">
            {selectedDocuments.length}
          </Badge>
        </div>
      </Button>
      <MenuPopover>
        <Menu>
          {trash ? (
            <>
              <MenuItem
                icon={DeletePutBackIcon}
                title="Dokumente zurücklegen"
                separator
                onClick={() => handleBulkRestore()}
              />
              <MenuItem
                icon={Delete04Icon}
                title="Endgültig löschen"
                variant="destructive"
                onClick={() => handleForceDelete()}
              />
            </>
          ) : (
            <>
              <MenuItem icon={FileEditIcon} title="Bearbeiten" separator />
              <MenuItem
                icon={Delete01Icon}
                title="In Papierkorb verschieben"
                variant="destructive"
                onClick={() => handleBulkMoveToTrash()}
              />
            </>
          )}
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
