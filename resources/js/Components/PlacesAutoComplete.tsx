import { AutoComplete } from '@/Components/Autocomplete'
import { usePlacesAutocomplete } from '@/Hooks/use-google-places-autocomplete'
import { usePlacesPlaceDetails } from '@/Hooks/use-google-places-place-details'
import type { GooglePlace } from '@/Hooks/use-google-places-place-details'
import { useDebounce } from '@react-hooks-library/core'
import { useEffect, useState } from 'react'
import { LogoSpinner } from './LogoSpinner'

export interface PlacesAutoCompleteProps {
  onPlaceSelected: (place: GooglePlace | null) => void
  placeholder?: string
  autoFocus?: boolean
}

export function PlacesAutoComplete({
  onPlaceSelected,
  placeholder = '',
  autoFocus = false
}: PlacesAutoCompleteProps) {
  const [selectedValue, setSelectedValue] = useState('')
  const [value, setValue] = useState('')

  const debouncedValue = useDebounce(value, 300)

  const { data: suggestions } = usePlacesAutocomplete(debouncedValue)
  const { data: place, isLoading } = usePlacesPlaceDetails(selectedValue)

  useEffect(() => {
    onPlaceSelected(place || null)
  }, [place])

  return (
    <div>
      <AutoComplete
        selectedValue={selectedValue}
        onSelectedValueChange={setSelectedValue}
        autoFocus={autoFocus}
        searchValue={value}
        onSearchValueChange={setValue}
        placeholder={placeholder}
        emptyMessage="Keine Adressen gefunden."
        items={
          suggestions?.map(item => ({
            value: item.placePrediction.placeId,
            label: item.placePrediction.text.text
          })) || []
        }
      />
      {isLoading && <LogoSpinner />}
    </div>
  )
}
