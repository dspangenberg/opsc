import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { useForm } from '@/Hooks/use-form'
import type { GooglePlace } from '@/Hooks/use-google-places-place-details'
import { useAccommodationStore } from '@/Pages/App/Accommodation/AccommodationCreate'
import { createRef, useEffect, useImperativeHandle, useState } from 'react';
import type * as React from 'react'
import { AccommodationCreateEmail } from './AccommodationCreateEmail'

interface Props {
  accommodation_types: App.Data.AccommodationTypeData[]
  countries: App.Data.CountryData[]
  regions: App.Data.RegionData[]
  onPlaceSelected: (place: GooglePlace) => void
}

export const AccommodationCreateBase = (
  {
    ref,
    accommodation_types,
    countries,
    regions
  }
) => {
  const { newAccommodation, mergeData } = useAccommodationStore()

  const editNameRef = createRef<HTMLInputElement>()

  const countryOptions = countries.map(country => {
    return { value: country.id, label: country.name }
  })

  const { data, errors, setData, validateAll, updateAndValidate, updateAndValidateWithoutEvent } =
    useForm<Partial<App.Data.AccommodationData>>(
      'post',
      route('app.accommodation.contact.store'),
      newAccommodation
    )

  useImperativeHandle(ref, () => ({
    validateStep: async () => {
      try {
        const result = await validateAll()
        mergeData(data)
        return typeof result === 'boolean' ? result : false
      } catch (error) {
        console.error('Validation failed:', error)
        return false
      }
    }
  }))

  const typeOptions = accommodation_types.map(type => ({
    value: type.id,
    label: type.title
  }))

  const handleEmailChange = (value: string) => {
    setData('email', value)
  }

  const handleValueChange = (name: keyof App.Data.AccommodationData, value: number) => {
    updateAndValidateWithoutEvent(name, Number.parseInt(value as unknown as string))
  }

  return (
    <form id="form">
      <FormErrors errors={errors} />
      <FormGroup>
        <div className="col-span-24">
          <AccommodationCreateEmail onValueChange={handleEmailChange} />
        </div>
        <div className="col-span-24">
          <FormInput
            id="phone"
            autoFocus
            ref={editNameRef}
            label="Telefonnummer"
            required
            value={data.phone || ''}
            error={errors?.phone}
            onBlur={updateAndValidate}
            onChange={updateAndValidate}
          />
        </div>

        <div className="col-span-24">
          <FormInput
            id="website"
            label="Webseite"
            required
            value={data.website}
            error={errors?.website || ''}
            onBlur={updateAndValidate}
            onChange={updateAndValidate}
          />
        </div>
      </FormGroup>
    </form>
  )
}

export default AccommodationCreateBase
