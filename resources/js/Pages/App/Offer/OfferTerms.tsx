import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { router } from '@inertiajs/core'
import type * as React from 'react'
import { useState } from 'react'
import { OfferDetailsLayout } from '@/Pages/App/Offer/OfferDetailsLayout'
import { OfferTermsSection } from '@/Pages/App/Offer/OfferTermsSection'
import type { PageProps } from '@/Types'
import { OfferDetailsSide } from './OfferDetailsSide'
import { OfferTermsSectionSelector } from './OfferTermsSectionSelector'

interface OfferTermsProps extends PageProps {
  offer: App.Data.OfferData
  textModules: App.Data.TextModuleData[]
  offerSections: App.Data.OfferSectionData[]
  children?: React.ReactNode
}

const OfferTerms: React.FC<OfferTermsProps> = ({ offerSections, offer, textModules }) => {
  const [editSection, setEditSection] = useState<number>(-1)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = offer.sections?.findIndex(section => section.id === active.id)
      const newIndex = offer.sections?.findIndex(section => section.id === over.id)

      if (oldIndex === undefined || newIndex === undefined || oldIndex < 0 || newIndex < 0) return

      const currentSections = offer.sections || []
      const newSections = [...currentSections]
      const [movedItem] = newSections.splice(oldIndex, 1)
      newSections.splice(newIndex, 0, movedItem)

      const sectionIds = newSections
        .map(section => section.id)
        .filter((id): id is number => id !== null)

      router.put(
        route('app.offer.sort-sections', { offer: offer.id }),
        { section_ids: sectionIds },
        {
          preserveScroll: true
        }
      )
    }
  }

  const handleSelector = async () => {
    const result = await OfferTermsSectionSelector.call({
      sections: offerSections
    })
    if (Array.isArray(result)) {
      router.post(route('app.offer.add-sections', { offer: offer.id }), { ids: result })
    }
  }

  const handleClick = (section: App.Data.OfferOfferSectionData) => {
    if (editSection === -1) {
      setEditSection(section.id as number)
    }
  }

  const handleDelete = (section: App.Data.OfferOfferSectionData) => {
    router.delete(route('app.offer.delete-section', { offer: offer.id, offerSection: section.id }))
    setEditSection(-1)
  }

  const handleSaved = () => {
    setEditSection(-1)
  }

  const onCancel = (_section: App.Data.OfferOfferSectionData) => {
    setEditSection(-1)
  }

  return (
    <OfferDetailsLayout offer={offer} onAddSection={() => handleSelector()}>
      <div className="flex-1 flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={
              offer.sections?.filter(line => line.id != null).map(line => line.id as number) || []
            }
            strategy={verticalListSortingStrategy}
          >
            {offer.sections?.map((section, index) => (
              <OfferTermsSection
                key={section.id ?? index}
                canDrag={editSection === -1}
                section={section}
                textModules={textModules}
                isReadOnly={!offer.is_draft}
                editMode={section.id === editSection}
                onClick={value => handleClick(value)}
                onSaved={handleSaved}
                onCancel={() => onCancel(section)}
                onDelete={() => handleDelete(section)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="h-fit w-sm flex-none space-y-6 px-1">
        <div className="fixed">
          <OfferDetailsSide offer={offer} />
        </div>
      </div>
    </OfferDetailsLayout>
  )
}

export default OfferTerms
