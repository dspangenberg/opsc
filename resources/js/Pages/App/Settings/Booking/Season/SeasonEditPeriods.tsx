/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { FormDateRangePicker } from '@/Components/FormDateRangePicker'
import { FormGroup } from '@/Components/FormGroup'
import { Button } from '@/Components/ui/button'
import { useForm } from '@/Hooks/use-form'
import { useSeasonStore } from '@/Pages/App/Settings/Booking/Season/SeasonEdit'
import { Add01Icon, Delete03Icon } from '@hugeicons-pro/core-stroke-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import { useModal } from '@inertiaui/modal-react'
import React, { useState, useImperativeHandle, useEffect } from 'react';

const SeasonEditPeriods = (
  {
    ref,
    ..._props
  }
) => {
  const season = useModal().props.season as App.Data.SeasonData
  const { newSeason, mergeSeason } = useSeasonStore()

  const [periods, setPeriods] = useState<App.Data.SeasonPeriodData[]>(newSeason?.periods || [])

  const { data, updateAndValidateWithoutEvent } = useForm<App.Data.SeasonData>(
    season.id ? 'put' : 'post',
    route(
      season.id ? 'app.settings.booking.seasons.update' : 'app.settings.booking.seasons.store',
      { id: season.id }
    ),
    newSeason
  )

  useEffect(() => {
    mergeSeason(data)
  }, [data])

  useImperativeHandle(ref, () => ({
    validatePage: async () => {
      // Implement your validation logic here
      return true // Return true if validation passes, false otherwise
    }
  }))

  useEffect(() => {
    if (!periods.length) {
      addPeriod()
    }
  }, [])

  const addPeriod = () => {
    const newPeriod: App.Data.SeasonPeriodData = {
      id: null,
      season_id: season.id as number,
      begin_on: '',
      end_on: ''
    }
    const updatedPeriods = [...periods, newPeriod]
    setPeriods(updatedPeriods)
    updateAndValidateWithoutEvent('periods', updatedPeriods)
  }

  const handlePeriodChange = (index: number, range: { from: string; to: string }) => {
    const updatedPeriods = periods.map((period, i) =>
      i === index ? { ...period, begin_on: range.from, end_on: range.to } : period
    )
    setPeriods(updatedPeriods)
    updateAndValidateWithoutEvent('periods', updatedPeriods)
  }

  const removePeriod = (event: React.MouseEvent, indexToRemove: number) => {
    event.preventDefault()
    const updatedPeriods = periods.filter((_, index) => index !== indexToRemove)
    setPeriods(updatedPeriods)
    updateAndValidateWithoutEvent('periods', updatedPeriods)
  }

  return (
    <form>
      <FormGroup>
        {periods.map((period, index) => (
          <React.Fragment key={index}>
            <div className="col-span-11">
              <FormDateRangePicker
                from={period.begin_on}
                to={period.end_on}
                onChange={range => handlePeriodChange(index, range)}
              />
            </div>
            <div className="col-span-13 ml-2">
              <Button size="icon" variant="outline" onClick={event => removePeriod(event, index)}>
                <HugeiconsIcon icon={Delete03Icon} className="size-5"  />
              </Button>
            </div>
          </React.Fragment>
        ))}
        <div className="col-span-24">
          <Button type="button" onClick={addPeriod}>
            <HugeiconsIcon icon={Add01Icon} className="size-5 mr-2"  />
            Add Period
          </Button>
        </div>
      </FormGroup>
    </form>
  )
}

export default SeasonEditPeriods
