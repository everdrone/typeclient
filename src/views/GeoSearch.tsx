import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Map, { Marker, NavigationControl, useControl } from 'react-map-gl'

// @ts-ignore
import { connectGeoSearch, GeoSearchProvided } from 'react-instantsearch-dom'
import { InstantSearch, Configure } from 'react-instantsearch-dom'

import useStore from 'lib/store'

const accessToken = 'pk.eyJ1IjoiZXZlcmRyb25lIiwiYSI6ImNsMjd3bDl6NTAxbW4zZG84Mnpvemhvb3EifQ.NK07hupZL8yXapGJAMiRlg'

interface GeoPoint {
  lat: number
  lng: number
}

interface GeoBounds {
  northEast: GeoPoint
  southWest: GeoPoint
}

function MapBox({ refine, hits, currentRefinement, position }: GeoSearchProvided) {
  const mapRef = React.useRef<mapboxgl.Map>()
  const [searchAsMove, setSearchAsMove] = useState(true)

  const searchAsMoveRef = useRef(searchAsMove)
  const [hasMovedSinceLastRefine, setHasMovedSinceLastRefine] = useState(false)
  const [userInitiated, setUserInitiated] = useState(false)

  const [lastMapPosition, setLastMapPosition] = useStore(state => [state.lastMapPosition, state.setLastMapPosition])
  const navigate = useNavigate()

  const handleOnLoad = React.useCallback(() => {
    if (!mapRef.current) return

    mapRef.current.on('movestart', () => {
      setUserInitiated(true)
      if (!searchAsMoveRef.current) {
        setHasMovedSinceLastRefine(true)
      }
    })

    mapRef.current.on('idle', () => {
      const center = mapRef.current.getCenter()
      const lat = center.lat
      const lng = center.lng
      const zoom = mapRef.current.getZoom()

      setLastMapPosition({ lat, lng, zoom })
    })

    mapRef.current.on('moveend', () => {
      setUserInitiated(false)
      if (searchAsMoveRef.current) {
        const latLngBounds = mapRef.current.getBounds()
        const ne = latLngBounds.getNorthEast()
        const sw = latLngBounds.getSouthWest()

        const bounds: GeoBounds = {
          northEast: {
            lat: ne.lat,
            lng: ne.lng,
          },
          southWest: {
            lat: sw.lat,
            lng: sw.lng,
          },
        }

        refine(bounds)
      }
    })

    // first refine
    const latLngBounds = mapRef.current.getBounds()
    const ne = latLngBounds.getNorthEast()
    const sw = latLngBounds.getSouthWest()
    refine({
      northEast: {
        lat: ne.lat,
        lng: ne.lng,
      },
      southWest: {
        lat: sw.lat,
        lng: sw.lng,
      },
    })
  }, [])

  function manualRefine() {
    const latLngBounds = mapRef.current.getBounds()
    const ne = latLngBounds.getNorthEast()
    const sw = latLngBounds.getSouthWest()

    const bounds: GeoBounds = {
      northEast: {
        lat: ne.lat,
        lng: ne.lng,
      },
      southWest: {
        lat: sw.lat,
        lng: sw.lng,
      },
    }

    refine(bounds)

    if (!searchAsMoveRef.current) {
      setHasMovedSinceLastRefine(false)
    }
  }

  useEffect(() => {
    searchAsMoveRef.current = searchAsMove
  }, [searchAsMove])

  // useEffect(() => {
  //   if (!userInitiated && hits.length > 0) {
  //     // Create a 'LngLatBounds' with both corners at the first coordinate.
  //     const bounds = new mapboxgl.LngLatBounds([hits[0]._geoloc, hits[0]._geoloc])

  //     // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
  //     for (const hit of hits) {
  //       bounds.extend(hit._geoloc)
  //     }

  //     mapRef.current.fitBounds(bounds, { padding: 50 })
  //   }
  // }, [currentRefinement, position])

  const markers = useMemo(
    () =>
      hits.map(({ _geoloc, objectID }: any) => {
        return (
          <Marker
            key={objectID}
            latitude={_geoloc.lat}
            longitude={_geoloc.lng}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/documents/edit/${objectID}`)}
          />
        )
      }),
    [hits]
  )

  const refineButton = (
    <div className="z-10 absolute left-0 right-0 top-0 bottom-0 pointer-events-none flex justify-center items-start">
      <div className="pointer-events-auto mt-5 rounded-full bg-canvas-inset px-4 py-3 shadow-xl">
        {hasMovedSinceLastRefine ? (
          <div className="flex items-center">
            <button className="text-xs uppercase" onClick={manualRefine}>
              Search here
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <input type="checkbox" checked={searchAsMove} onChange={e => setSearchAsMove(e.target.checked)} />
            <label className="m-0 ml-2 text-xs uppercase">Search as I move the map</label>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="absolute inset-0">
      <Map
        ref={mapRef as React.MutableRefObject<any>}
        // todo: store this stuff in the store!
        initialViewState={
          lastMapPosition
            ? {
                zoom: lastMapPosition.zoom,
                latitude: lastMapPosition.lat,
                longitude: lastMapPosition.lng,
              }
            : {
                zoom: 3.5,
                latitude: 47.061,
                longitude: 15.718,
              }
        }
        // minZoom={3}
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
        mapStyle="mapbox://styles/everdrone/cl35pegpu007k15qf92e80fxw"
        onLoad={handleOnLoad}
        mapboxAccessToken={accessToken}
      >
        {refineButton}
        <NavigationControl showCompass={false} position="top-left" />
        {markers}
      </Map>
    </div>
  )
}

const ConnectedMapBox = connectGeoSearch(MapBox)

export default function GeoSearch() {
  console.log('MapBox Geo Search')

  const [adapter, collections, currentCollectionName] = useStore(state => [
    state.adapter,
    state.collections,
    state.currentCollectionName,
  ])

  const currentCollection = collections[currentCollectionName]

  if (!adapter || !currentCollection) {
    console.log(adapter, currentCollection)
    return null
  }

  return (
    <div className="absolute inset-0">
      <InstantSearch searchClient={adapter.searchClient} indexName={currentCollection.schema.name}>
        <Configure hitsPerPage={150} />
        <ConnectedMapBox />
      </InstantSearch>
    </div>
  )
}
