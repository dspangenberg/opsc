/*
 * obooli.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormCheckbox } from '@/Components/FormCheckbox'
import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { FormInputColorPicker } from '@/Components/FormInputColorPicker'
import { FormLabel } from '@/Components/FormLabel'
import { FormRadioGroup, type Option } from '@/Components/FormRadioGroup'
import { InfoIcon } from '@/Components/InfoIcon'
import { useForm } from '@/Hooks/use-form'
import { useSeasonStore } from '@/Pages/App/Settings/Booking/Season/SeasonEdit'
import { useModal } from '@inertiaui/modal-react'
import type React from 'react'
import { useEffect } from 'react'
import { forwardRef, useImperativeHandle, useState } from 'react'

const SeasonEditBase = forwardRef<
  { validatePage: () => Promise<boolean> },
  React.PropsWithChildren
>((_props, ref) => {
  const season = useModal().props.season as App.Data.SeasonData
  const { newSeason, setSeason } = useSeasonStore()

  const bookingModes: Option<number>[] = [
    {
      id: 0,
      name: 'nicht buchbar'
    },
    {
      id: 1,
      name: 'nur Inhouse buchbar'
    },
    {
      id: 2,
      name: 'Inhouse + Online buchbar'
    }
  ]

  const { data, errors, updateAndValidate, validateAll, updateAndValidateWithoutEvent } =
    useForm<App.Data.SeasonData>(
      season.id ? 'put' : 'post',
      route(
        season.id ? 'app.settings.booking.seasons.update' : 'app.settings.booking.seasons.store',
        { id: season.id }
      ),
      newSeason
    )




  useEffect(() => {
    setSeason(data)
  }, [data])

  useImperativeHandle(ref, () => ({
    validatePage: async () => {
      try {
        const result = await validateAll()
        return typeof result === 'boolean' ? result : false
      } catch (error) {
        console.error('Validation failed:', error)
        return false
      }
    }
  }))

  const [selectedBookingMode, setSelectedBookingMode] = useState<number>(data.booking_mode || 0)

  const handleBookingModeChange = (value: number) => {
    setSelectedBookingMode(value)
    updateAndValidateWithoutEvent('booking_mode', value)
  }

  const handleColorChange = (color: string) => {
    updateAndValidateWithoutEvent('color', color)
  }

  const handleValueChange = (name: keyof App.Data.SeasonData, value: number | boolean) => {
    updateAndValidateWithoutEvent(name, value)
  }

  return (
    <form>
      <FormErrors errors={errors} />
      <FormGroup>
        <div className="col-span-15 md:col-span-18">
          <FormInput
            id="name"
            autoFocus
            label="Bezeichnung"
            value={data.name}
            error={errors?.name || ''}
            onChange={updateAndValidate}
          />
        </div>
        <div className="col-span-9 md:col-span-6">
          <div className="space-y-2">
            <FormInputColorPicker
              id="color"
              label="Farbe"
              value={data.color || ''}
              onChange={handleColorChange}
              error={errors?.color}
            />
          </div>
        </div>
        <div className="col-span-24">
          <div className="pb-2">
            <FormLabel>Buchungsmodus:</FormLabel>
          </div>
          <FormRadioGroup
            value={selectedBookingMode}
            onValueChange={handleBookingModeChange}
            options={bookingModes}
          />
        </div>
        <div className="col-span-24">
          <div className="flex items-center space-x-1">
            {data.booking_mode !== 0 && (
              <>
                <FormCheckbox
                  id="has_season_related_restrictions"
                  label="Saisonelle Buchungsbeschränkungen"
                  checked={data.has_season_related_restrictions}
                  onCheckedChange={value => {
                    handleValueChange('has_season_related_restrictions', value as boolean)
                  }}
                />
                <InfoIcon>
                  Falls es in der Saison besondere Buchungsbeschränkungen (Anreisetage,
                  Mindestaufenthalt etc.) gibt, kannst Du diese nach Aktivierung des
                  Kontrollkästchens im Tab Beschränkungen definieren. Allgemeine, nicht saisonelle,
                  Buchungsbeschränkungen kannst Du in den Stammdaten Deiner Unterkunft hinterlegen.
                </InfoIcon>
              </>
            )}
          </div>
        </div>
      </FormGroup>
    </form>
  )
})

export default SeasonEditBase
