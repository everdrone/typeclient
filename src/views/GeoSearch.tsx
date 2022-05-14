import React from 'react'

import useStore from 'lib/store'

import 'styles/ais.scss'

import { InstantSearch, SearchBox, Stats, Configure } from 'react-instantsearch-dom'
// @ts-ignore
import { GoogleMapsLoader, GeoSearch, Control, Marker } from 'react-instantsearch-dom-maps'

export default function GeoSearch() {
  console.log('Geo Search')
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
      <InstantSearch searchClient={adapter.searchClient} indexName={currentCollection!.schema.name}>
        <Configure hitsPerPage={250} attributesToRetrieve={['location']} />
        <GoogleMapsLoader apiKey="AIzaSyBZoOEupEPyyp_ycqy8dx-FJWJadZeDbmA">
          {/* @ts-ignore */}
          {google => (
            // @ts-ignore
            <GeoSearch
              google={google}
              options={{
                minZoom: 4,
                restriction: {
                  latLngBounds: {
                    north: 85,
                    south: -85,
                    west: -180,
                    east: 180,
                  },
                },
              }}
            >
              {({ hits }: any) => (
                <div>
                  <Control />
                  {hits.map((hit: any) => (
                    <Marker key={hit.objectID} hit={hit} />
                  ))}
                </div>
              )}
            </GeoSearch>
          )}
        </GoogleMapsLoader>
      </InstantSearch>
    </div>
  )
}
