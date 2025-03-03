/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

import { useBreadcrumbProvider } from '@/Components/breadcrumb-provider'
import mapboxgl from 'mapbox-gl'
import { useEffect, useRef } from 'react'
import type * as React from 'react'

interface Props {
  accommodation: App.Data.AccommodationData
}


const AccommodationDetails: React.FC<Props> = ({ accommodation }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const { setBreadcrumbs } = useBreadcrumbProvider()

  useEffect(() => {
    setBreadcrumbs([
      {title: 'Unterkünfte', route: route('app.accommodation.index') },
      {title: accommodation.name, route: route('app.accommodation.details', { id: accommodation.name })}
    ])
  }, [setBreadcrumbs])

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY as string
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Add a default style
      center: accommodation.coordinates.coordinates,
      zoom: 16
    })

    new mapboxgl.Marker().setLngLat(accommodation.coordinates.coordinates).addTo(mapRef.current)


    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [accommodation.coordinates.coordinates])

  return (
    <div>
      <div className="mx-auto h-24 w-full rounded-xl  py-6">
        <h1 className="text-lg font-bold">{accommodation.name}</h1>
        <div className="text-base font-medium">
          {accommodation.street}, {accommodation.zip} {accommodation.city}
        </div>
      </div>
      <div className="mx-auto h-full w-full  rounded-xl py-6">
        <div id="map-container" style={{ width: '100%', height: '250px' }} ref={mapContainerRef} />
      </div>
    </div>
  )
}

export default AccommodationDetails
