import { FormGroup } from '@/Components/FormGroup'
import { PlacesAutoComplete } from '@/Components/PlacesAutoComplete'
import type { GooglePlace } from '@/Hooks/use-google-places-place-details'
import { useAccommodationStore } from '@/Pages/App/Accommodation/AccommodationCreate'
import { forwardRef, useImperativeHandle } from 'react'
import type * as React from 'react'

interface Props {
  accommodation_types: App.Data.AccommodationTypeData[]
  countries: App.Data.CountryData[]
  regions: App.Data.RegionData[]
  onPlaceSelected: (place: GooglePlace) => void
}

export const AccommodationCreateStart = forwardRef<{ validateStep: () => Promise<boolean> }, Props>(
  ({ countries, regions, onPlaceSelected }, ref) => {
    const { setNewAccommodation } = useAccommodationStore()

    const handlePlaceSelected = (place: GooglePlace | null) => {
      if (place) {
        const country = countries.find(c => c.iso_code === place?.address?.country)
        const region = regions.find(
          c =>
            c.short_name === place?.address?.region || c.place_short_name === place?.address?.region
        )

        const newData = {
          ...place.address,
          name: place?.name || '',
          place_id: place?.id || '',
          country_id: country?.id ? Number(country.id) : undefined,
          phone: place.phone || '',
          website: place.website || '',
          region_id: region?.id ? Number(region.id) : undefined,
          latitude: place.latitude || 0,
          longitude: place.longitude || 0
        }

        setNewAccommodation(newData)
        onPlaceSelected(place)
      }
    }

    useImperativeHandle(ref, () => ({
      validateStep: async () => {
        // Implement validation logic
        return true
      }
    }))

    return (
      <form id="form">
        <FormGroup>
          <div className="col-span-24">
            <PlacesAutoComplete
              onPlaceSelected={handlePlaceSelected}
              placeholder="Suchtext"
              autoFocus
            />
            <div className="text-xs text-gray-500 px-1 pt-1.5">
              Suche nach Deiner Unterkunft oder Anschrift über GooglePlaces
            </div>
          </div>
        </FormGroup>
      </form>
    )
  }
)

export default AccommodationCreateStart
