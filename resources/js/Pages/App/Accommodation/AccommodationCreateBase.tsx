import { FormErrors } from '@/Components/FormErrors'
import { FormGroup } from '@/Components/FormGroup'
import { FormInput } from '@/Components/FormInput'
import { FormSelect, type Option } from '@/Components/FormSelect'
import { useForm } from '@/Hooks/use-form'
import type { GooglePlace } from '@/Hooks/use-google-places-place-details'
import { useAccommodationStore } from '@/Pages/App/Accommodation/AccommodationCreate'
import { createRef, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import type * as React from 'react'

interface Props {
  accommodation_types: App.Data.AccommodationTypeData[]
  countries: App.Data.CountryData[]
  regions: App.Data.RegionData[]
  onPlaceSelected: (place: GooglePlace) => void
}

export const AccommodationCreateBase = forwardRef<{ validateStep: () => Promise<boolean> }, Props>(
  ({ accommodation_types, countries, regions }, ref) => {
    const { newAccommodation, mergeData } = useAccommodationStore()

    const editNameRef = createRef<HTMLInputElement>()

    const countryOptions = countries.map(country => {
      return { value: country.id, label: country.name }
    })

    const [filteredRegions, setFilteredRegions] = useState<Option<number>[]>([])

    const { data, errors, validateAll, updateAndValidate, updateAndValidateWithoutEvent } = useForm<
      Partial<App.Data.AccommodationData>
    >('post', route('app.accommodation.base.store'), newAccommodation)

    useEffect(() => {
      const filtered: Option<number>[] = regions
        .filter(item => item.country_id === data.country_id)
        .map(item => ({
          value: item.id,
          label: item.name
        }))
      setFilteredRegions(filtered)
      if (data.region_id) {
        updateAndValidateWithoutEvent('region_id', data.region_id)
      }
    }, [data.country_id, regions, newAccommodation.country_id])

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

    const handleValueChange = (name: keyof App.Data.AccommodationData, value: number) => {
      updateAndValidateWithoutEvent(name, Number.parseInt(value as unknown as string))
    }

    return (
      <form id="form">
        <FormErrors errors={errors} />
        <FormGroup>
          <div className="col-span-24">
            <FormInput
              id="name"
              autoFocus
              ref={editNameRef}
              label="Unterkunftsbezeichnung"
              required
              value={data.name || ''}
              error={errors?.name}
              onBlur={updateAndValidate}
              onChange={updateAndValidate}
            />
          </div>

          <div className="col-span-24">
            <FormSelect<number>
              id="type_id"
              label="Unterkunftsart"
              required
              value={data.type_id || 0}
              error={errors?.type_id}
              onValueChange={value => { handleValueChange('type_id', value); }}
              options={typeOptions}
            />
          </div>
          <div className="col-span-24">
            <FormInput
              id="street"
              placeholder="Straße"
              label="Straße"
              required
              value={data.street}
              error={errors?.street || ''}
              onBlur={updateAndValidate}
              onChange={updateAndValidate}
            />
          </div>

          <div className="col-span-6">
            <FormInput
              id="zip"
              label="PLZ"
              required
              value={data.zip}
              error={errors?.zip || ''}
              onChange={updateAndValidate}
              onBlur={updateAndValidate}
            />
          </div>
          <div className="col-span-18">
            <FormInput
              id="city"
              label="Ort"
              required
              value={data.city}
              error={errors?.city || ''}
              onBlur={updateAndValidate}
              onChange={updateAndValidate}
            />
          </div>
          <div className="col-span-24 md:col-span-12">
            <FormSelect<number>
              id="country_id"
              defaultValue={0}
              label="Land"
              required
              value={data.country_id || 0}
              onValueChange={value => handleValueChange('country_id', value)}
              options={countryOptions}
            />
          </div>
          <div className="col-span-24 md:col-span-12">
            <FormSelect<number>
              id="region_id"
              label="Region"
              required
              defaultValue={0}
              value={data.region_id || 0}
              onValueChange={value => handleValueChange('region_id', value)}
              options={filteredRegions}
            />
          </div>
        </FormGroup>
      </form>
    )
  }
)

export default AccommodationCreateBase
