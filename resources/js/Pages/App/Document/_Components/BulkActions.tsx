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
import { DocumentBulkEdit } from '@/Pages/App/Document/DocumentBulkEdit'
import { DocumentIndexContext } from '@/Pages/App/Document/DocumentIndexContext'

interface BulkActionsProps {
  trash: boolean
  documentTypes: App.Data.DocumentTypeData[]
  contacts: App.Data.ContactData[]
  projects: App.Data.ProjectData[]
}
export const BulkActions: React.FC<BulkActionsProps> = ({
  contacts,
  documentTypes,
  projects,
  trash
}) => {
  const { selectedDocuments, setSelectedDocuments } = useContext(DocumentIndexContext)

  if (!selectedDocuments.length) return null

  const handleBulkEdit = async () => {
    const result = await DocumentBulkEdit.call({
      contacts,
      projects,
      documentTypes
    })
    if (result !== false) {
      // Filter out 0 values before sending
      const filteredResult = Object.fromEntries(
        Object.entries(result).filter(([_, value]) => value !== 0 && value !== null)
      )

      router.put(
        route('app.document.bulk-edit'),
        {
          ids: selectedDocuments.join(','),
          ...filteredResult
        },
        {
          onSuccess: () => setSelectedDocuments([])
        }
      )
    }
  }

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
        }),
        {
          onSuccess: () => setSelectedDocuments([])
        }
      )
    }
  }

  const handleBulkRestore = async () => {
    const promise = await AlertDialog.call({
      title: 'Dokumente zurücklegen',
      message: `Möchtest Du die ausgewählten Dokumente (${selectedDocuments.length}) wirklich zurücklegen?`,
      buttonTitle: 'Dokumente zurücklegen'
    })
    if (promise) {
      router.put(
        route('app.document.bulk-restore'),
        { ids: selectedDocuments.join(',') },
        {
          onSuccess: () => setSelectedDocuments([])
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
              <MenuItem
                icon={FileEditIcon}
                title="Bearbeiten"
                separator
                onClick={() => handleBulkEdit()}
              />
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
