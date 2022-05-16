import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import {
  InstantSearch,
  SearchBox,
  SortBy,
  ToggleRefinement,
  RangeInput,
  RefinementList,
  ClearRefinements,
  CurrentRefinements,
  Stats,
} from 'react-instantsearch-dom'
import { Navigate } from 'react-router-dom'

import useStore from 'lib/store'
import LoadMoreHits from 'components/LoadMoreHits'

import { Tabular } from 'components/hits'

export default function Search() {
  // FIXME: when new collections are created, the store doesn't update
  // create a function to update the store when routes change
  console.log('Search')
  const [client, adapter, collections, currentCollectionName, refreshCollections, deleteDocument] = useStore(state => [
    state.client,
    state.adapter,
    state.collections,
    state.currentCollectionName,
    state.refreshCollections,
    state.deleteDocument,
  ])

  const currentCollection = collections[currentCollectionName]

  // NOTE: this is gonna change in v0.23: [...].includes(field.type) && field.sort
  const sortBy = [{ label: 'Default', value: currentCollectionName }]
  currentCollection &&
    currentCollection.schema.fields
      .filter(field => ['int32', 'int32[]', 'int64', 'int64[]', 'float', 'float[]'].includes(field.type))
      .map(field => {
        sortBy.push({ label: `${field.name} asc`, value: `${currentCollectionName}/sort/${field.name}:asc` })
        sortBy.push({ label: `${field.name} desc`, value: `${currentCollectionName}/sort/${field.name}:desc` })
      })

  const stringFacets = currentCollection
    ? currentCollection.schema.fields.filter(
        field => ['string', 'string[]', 'string*', 'auto'].includes(field.type) && field.facet
      )
    : []

  const numberFacets = currentCollection
    ? currentCollection.schema.fields.filter(
        field => ['int32', 'int32[]', 'int64', 'int64[]', 'float', 'float[]'].includes(field.type) && field.facet
      )
    : []

  const boolFacets = currentCollection
    ? currentCollection.schema.fields.filter(field => ['bool', 'bool[]'].includes(field.type) && field.facet)
    : []

  useEffect(() => {
    refreshCollections()

    ipcRenderer.on('deleteDocument', (event, data) => {
      deleteDocument(currentCollectionName, data.id)
    })

    return () => {
      ipcRenderer.removeAllListeners('deleteDocument')
    }
  }, [])

  if (!client || !adapter || !currentCollection) {
    console.log(client, adapter)
    // return null
    return <Navigate replace to="/" />
  }

  return (
    <InstantSearch searchClient={adapter.searchClient} indexName={currentCollection.schema.name}>
      <div id="top">
        <SearchBox />
        <CurrentRefinements />
        <Stats />
      </div>
      <div id="middle" className="grow relative flex">
        <div className="absolute inset-0 flex overflow-auto">
          <div id="refinements" className="relative">
            <SortBy items={sortBy} defaultRefinement={currentCollectionName} />
            <ClearRefinements translations={{ reset: 'Clear refinements' }} />
            {boolFacets.map(facet => (
              <div key={facet.name}>
                <ToggleRefinement attribute={facet.name} label={facet.name} value={true} />
              </div>
            ))}
            {numberFacets.map(facet => (
              <div key={facet.name}>
                <label>{facet.name}</label>
                <RangeInput attribute={facet.name} />
              </div>
            ))}
            {stringFacets.map(facet => (
              <div key={facet.name}>
                <label>{facet.name}</label>
                <RefinementList
                  attribute={facet.name}
                  searchable
                  translations={{
                    placeholder: `Search ${facet.name}`,
                  }}
                />
              </div>
            ))}
          </div>
          <div id="results" className="relative grow">
            <LoadMoreHits component={Tabular} />
          </div>
        </div>
      </div>
    </InstantSearch>
  )
}
