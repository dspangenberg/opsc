/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useQuery } from '@tanstack/react-query'

export interface PlacePrediction {
  placePrediction: {
    placeId: string
    text: { text: string }
  }
  place_id: string
  description: string
}
const queryAutocompleteOptions = (input: string) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': import.meta.env.VITE_APP_GMAPS_KEY
    },
    body: JSON.stringify({
      input: input,
      includedPrimaryTypes: [],
      // Location biased towards the user's country
      includedRegionCodes: ['DE', 'AT', 'CH', 'NL']
    })
  }
}

const fetchPlaces = async (search: string): Promise<PlacePrediction[]> => {
  if (!search) return []
  const response = await fetch(
    'https://places.googleapis.com/v1/places:autocomplete',
    queryAutocompleteOptions(search)
  )
  const json = await response.json()
  return json?.suggestions || []
}

export const usePlacesAutocomplete = (searchString: string) => {
  return useQuery<PlacePrediction[]>({
    queryKey: ['PlacesAutocomplete', searchString],
    queryFn: () => fetchPlaces(searchString)
  })
}
