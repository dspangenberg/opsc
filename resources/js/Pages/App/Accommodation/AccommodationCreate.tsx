/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useConfirm } from '@/Components/AlertDialogProvider'
import { Button } from '@/Components/Button'
import { ResponsiveDialog } from '@/Components/ResponsiveDialog'
import type { GooglePlace } from '@/Hooks/use-google-places-place-details'
import { useMediaQuery } from '@/Hooks/use-media-query'
import { cn } from '@/Lib/utils'
import { router } from '@inertiajs/react'
import { defineStepper } from '@stepperize/react'
import { useRef, useState } from 'react'
import type * as React from 'react'

import { create } from 'zustand'
import AccommodationCreateBase from './AccommodationCreateBase'
import AccommodationCreateContact from './AccommodationCreateContact'
import AccommodationCreateStart from './AccommodationCreateStart'

const { useStepper, Scoped } = defineStepper(
  { id: 'start', title: 'Unterkunft- und Adresssuche', index: 0 },
  { id: 'base', title: 'Stammdaten', index: 1 },
  { id: 'contact', title: 'Kontaktdaten', index: 2 }
)

const desktop = '(min-width: 768px)'

interface AccommodationState {
  newAccommodation: Partial<App.Data.AccommodationData>
  mergeData: (data: Partial<App.Data.AccommodationData>) => void
  setNewAccommodation: (data: Partial<App.Data.AccommodationData>) => void
}

export const useAccommodationStore = create<AccommodationState>(set => ({
  newAccommodation: {},
  mergeData: (data: Partial<App.Data.AccommodationData>) =>
    set(state => ({
      newAccommodation: {
        ...state.newAccommodation,
        ...data
      }
    })),
  setNewAccommodation: (data: Partial<App.Data.AccommodationData>) =>
    set({ newAccommodation: data })
}))

interface Props {
  accommodation_types: App.Data.AccommodationTypeData[]
  countries: App.Data.CountryData[]
  regions: App.Data.RegionData[]
  accommodation: App.Data.AccommodationData
}
const AccommodationCreate: React.FC<Props> = ({ accommodation_types, countries, regions }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleInteractOutside = (event: Event) => {
    event.preventDefault()
  }

  const { newAccommodation } = useAccommodationStore()

  const isDesktop = useMediaQuery(desktop)

  const baseRef = useRef<{
    validateStep: () => Promise<boolean>
  } | null>(null)

  const contactRef = useRef<{
    validateStep: () => Promise<boolean>
  } | null>(null)

  const handleNextPage = async () => {
    let isValid = false
    if (stepper.current.id === 'base') {
      if (baseRef.current) {
        console.log('Validating base data')
        isValid = await baseRef.current.validateStep()
      }
    }
    if (stepper.current.id === 'contact') {
      if (contactRef.current) {
        console.log('Validating base data')
        isValid = await contactRef.current.validateStep()
      }
    }
    if (isValid) {
      if (stepper.current.id === 'contact') {
        console.log(newAccommodation)
        router.post(route('app.accommodation.store'), newAccommodation)
      }
      stepper.next()
    }
  }

  const handlePlaceSelected = (place: GooglePlace) => {
    console.log('Place selected:', place)
    console.log(newAccommodation)
    stepper.next()
  }

  const confirm = useConfirm()
  const stepper = useStepper()
  const handleClose = async () => {
    const isConfirmed = await confirm({
      title: 'Änderungen verwerfen',
      body: 'Möchtest Du die geänderten Daten wirklich verwerfen?',
      cancelButton: 'Abbrechen',
      actionButtonVariant: 'danger',
      actionButton: 'Daten verwerfen'
    })

    if (isConfirmed) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <div className="mx-auto h-24 w-full max-w-7xl rounded-xl bg-muted/50" />
      <div className="mx-auto h-full w-full max-w-7xl rounded-xl bg-muted/50 p-8">
        <Button
          variant="primary"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Unterkunft hinzufügen
        </Button>
        <ResponsiveDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false)
          }}
          onInteractOutside={handleInteractOutside}
          dismissible={true}
          onOpenChange={handleClose}
          className="max-w-xl"
          title="Unterkunft hinzufügen"
          description="Keine Unterkunft, keine Kekse"
          footer={
            <div className="flex-1 items-center justify-start flex flex-col md:flex-row space-y-2 md:space-y-0">
              <div className="flex md:justify-start justify-center items-center space-x-1.5 flex-1">
                {[...Array(stepper.all.length)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-1.5 w-1.5 rounded-full bg-blue-900',
                      index === stepper.current?.index ? 'bg-blue-500' : 'opacity-20'
                    )}
                  />
                ))}
              </div>
              {!isDesktop && (
                <div className="flex-1 w-full">
                  <Button onClick={handleClose}>Abbrechen</Button>
                </div>
              )}
              <div className="flex-1 w-full flex items-center justify-end space-x-2 flex-col md:flex-row space-y-2 md:space-y-0">
                <Button disabled={stepper.isFirst} onClick={stepper.prev}>
                  Zurück
                </Button>
                <Button form="form" variant="primary" onClick={handleNextPage}>
                  {stepper.isLast ? 'Speichern' : 'Weiter'}
                </Button>
              </div>
            </div>
          }
        >
          <Scoped>
            {stepper.switch({
              start: () => (
                <AccommodationCreateStart
                  accommodation_types={accommodation_types}
                  regions={regions}
                  countries={countries}
                  onPlaceSelected={handlePlaceSelected}
                />
              ),
              base: () => (
                <AccommodationCreateBase
                  accommodation_types={accommodation_types}
                  regions={regions}
                  countries={countries}
                  onPlaceSelected={handlePlaceSelected}
                  ref={baseRef}
                />
              ),
              contact: () => (
                <AccommodationCreateContact
                  accommodation_types={accommodation_types}
                  regions={regions}
                  countries={countries}
                  onPlaceSelected={handlePlaceSelected}
                  ref={contactRef}
                />
              )
            })}
          </Scoped>
        </ResponsiveDialog>
      </div>
    </>
  )
}

export default AccommodationCreate
