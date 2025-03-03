/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

// ... previous code remains the same

import { useQuery } from '@tanstack/react-query'
import { camelCase } from 'moderndash'

const neededAddressComponents: string[] = [
  'route',
  'street_number',
  'locality',
  'administrative_area_level_1',
  'country',
  'postal_code'
]
interface OrgAddressComponent {
  longText: string
  shortText: string
  types: string[]
}

interface AddressComponent {
  [key: string]: string
}

interface GooglePlaceRoot {
  id: string
  internationalPhoneNumber?: string
  websiteUri?: string
}

export interface OrgGooglePlace extends GooglePlaceRoot {
  addressComponents: OrgAddressComponent[]
  formattedAddress: string
  displayName: {
    text: string
    languageCode: string
  }
  location: {
    latitude: number
    longitude: number
  }
}

export interface GooglePlace extends GooglePlaceRoot {
  address: AddressComponent
  formatted_address: string
  name: string
  phone: string
  website: string
  latitude: number
  longitude: number
}

const getAddressComponents = (components: OrgAddressComponent[]) => {
  const foundAddressComponents: AddressComponent = {}
  for (const item of components) {
    for (const type of item.types) {
      if (neededAddressComponents.includes(type)) {
        foundAddressComponents[camelCase(type)] =
          type === 'locality' ? item.longText : item.shortText
      }
    }
  }
  return foundAddressComponents
}

const normalizeAddress = (place: OrgGooglePlace): AddressComponent => {
  const addressComponents = getAddressComponents(place.addressComponents)
  return {
    street: `${addressComponents.route} ${addressComponents.streetNumber}`,
    city: addressComponents.locality,
    region: addressComponents.administrativeAreaLevel1,
    country: addressComponents.country,
    zip: addressComponents.postalCode
  }
}

const fetchPlaceDetails = async (placeId: string): Promise<GooglePlace> => {
  const url = `https://places.googleapis.com/v1/places/${placeId}`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_APP_GMAPS_KEY,
        'X-Goog-FieldMask':
          'adrFormatAddress,displayName,id,shortFormattedAddress,formattedAddress,location,addressComponents,internationalPhoneNumber,websiteUri'
      }
    })

    const place: OrgGooglePlace = await response.json()
    return {
      id: place.id,
      // formatted_address: place.formatted_address,
      phone: place.internationalPhoneNumber || '',
      website: place.websiteUri ?? '',
      name: place.displayName.text || '',
      latitude: place.location.latitude,
      longitude: place.location?.longitude,
      address: normalizeAddress(place),
      formatted_address: place.formattedAddress
    }
  } catch (error) {
    console.error('Error fetching place details:', error)
    throw error
  }
}

export const usePlacesPlaceDetails = (placeId: string) => {
  return useQuery<GooglePlace>({
    queryKey: ['PlacesPlaceDetails', placeId],
    queryFn: () => fetchPlaceDetails(placeId),
    enabled: !!placeId
  })
}
