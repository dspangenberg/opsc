/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { InertiaDialog } from '@/Components/InertiaDialog'
import { SimpleTabs, SimpleTabsTab } from '@/Components/SimpleTabs'
import { Button } from '@/Components/ui/button'
import { router } from '@inertiajs/react'
import { useModal } from '@inertiaui/modal-react'
import type { FC, MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import SeasonEditBase from './SeasonEditBase'
import SeasonEditPeriods from './SeasonEditPeriods'

export interface SeasonState {
  newSeason: Partial<App.Data.SeasonData>
  mergeSeason: (data: Partial<App.Data.SeasonData>) => void
  setSeason: (
    data:
      | Partial<App.Data.SeasonData>
      | ((prevSeason: Partial<App.Data.SeasonData>) => Partial<App.Data.SeasonData>),
  ) => void
}

export const useSeasonStore = create<SeasonState>(set => ({
  newSeason: {},
  mergeSeason: (data: Partial<App.Data.SeasonData>) =>
    set(state => ({
      newSeason: {
        ...state.newSeason,
        ...data,
      },
    })),
  setSeason: (data: Partial<App.Data.SeasonData>) => set({ newSeason: data }),
}))

const SeasonEdit: FC = () => {
  const updateAndValidateWithoutEvent = (name: keyof App.Data.SeasonData, value: any) => {
    // Implementation of updateAndValidateWithoutEvent
  }
  const { close } = useModal()
  const season = useModal().props.season as App.Data.SeasonData

  const { setSeason, newSeason, mergeSeason } = useSeasonStore()

  const baseRef = useRef<{
    validatePage: () => Promise<boolean>
  } | null>(null)

  const periodsRef = useRef<{
    validatePage: () => Promise<boolean>
  } | null>(null)

  useEffect(() => {
    setSeason(season)
  }, [season, setSeason])

  const dialogRef = useRef<HTMLDivElement>(null)
  const [tab, setTab] = useState("tab-base")

  const handleClose = () => {
    close()
  }

  const updateNewSeason = useCallback(
    (data: Partial<App.Data.SeasonData>) => {
      mergeSeason(data)
    },
    [mergeSeason],
  )

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      if (tab === "tab-base") {
        await baseRef?.current?.validatePage()
      } else if (tab === "tab-periods") {
        await periodsRef?.current?.validatePage()
      }
      router.put(route("app.settings.booking.seasons.update", { id: newSeason.id }), newSeason, {
        onSuccess: () => {
          close()
        },
      })
    } catch (error) {
      console.error("Form submission failed", error)
    }
  }

  const handleValueChange = (name: keyof App.Data.SeasonData, value: any) => {
    updateAndValidateWithoutEvent(name, value)
    updateNewSeason({ [name]: value })
  }

  return (
    <InertiaDialog
      ref={dialogRef}
      title="Saison bearbeiten"
      onClose={handleClose}
      className="max-w-xl"
      description="Saisons, Zeiträume und Buchungsbeschränkungen werden hier festgelegt."
      data-inertia-dialog
      dismissible={true}
      tabs={
        <SimpleTabs defaultValue="tab-1" value={tab} onValueChange={tab => setTab(tab)}>
          <SimpleTabsTab value="tab-base">Basis</SimpleTabsTab>
          <SimpleTabsTab value="tab-periods" disabled={newSeason.is_default}>
            Zeiträume
          </SimpleTabsTab>
        </SimpleTabs>
      }
      footer={
        <div className="flex items-center justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button form="form-season-edit" type="button" onClick={handleSubmit}>
            Speichern
          </Button>
        </div>
      }
    >
      <div>
        {tab === "tab-periods" ? (
          <SeasonEditPeriods ref={periodsRef} />
        ) : (
          <SeasonEditBase ref={baseRef} />
        )}
      </div>
    </InertiaDialog>
  )
}

export default SeasonEdit
