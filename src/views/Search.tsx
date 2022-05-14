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

import useStore from 'lib/store'
import LoadMoreHits from 'components/LoadMoreHits'

import { Tabular } from 'components/hits'

export default function Search() {
  // FIXME: when new collections are created, the store doesn't update
  // create a function to update the store when routes change
  console.log('Search')
  const [adapter, collections, currentCollectionName, deleteDocument] = useStore(state => [
    state.adapter,
    state.collections,
    state.currentCollectionName,
    state.deleteDocument,
  ])

  const currentCollection = collections[currentCollectionName]

  // NOTE: this is gonna change in v0.23: [...].includes(field.type) && field.sort
  const sortBy = [{ label: 'Default', value: currentCollectionName }]
  currentCollection.schema.fields
    .filter(field => ['int32', 'int32[]', 'int64', 'int64[]', 'float', 'float[]'].includes(field.type))
    .map(field => {
      sortBy.push({ label: `${field.name} asc`, value: `${currentCollectionName}/sort/${field.name}:asc` })
      sortBy.push({ label: `${field.name} desc`, value: `${currentCollectionName}/sort/${field.name}:desc` })
    })

  const stringFacets = currentCollection.schema.fields.filter(
    field => ['string', 'string[]', 'string*', 'auto'].includes(field.type) && field.facet
  )

  const numberFacets = currentCollection.schema.fields.filter(
    field => ['int32', 'int32[]', 'int64', 'int64[]', 'float', 'float[]'].includes(field.type) && field.facet
  )

  const boolFacets = currentCollection.schema.fields.filter(
    field => ['bool', 'bool[]'].includes(field.type) && field.facet
  )

  useEffect(() => {
    ipcRenderer.on('deleteDocument', (event, data) => {
      deleteDocument(currentCollectionName, data.id)
    })

    return () => {
      ipcRenderer.removeAllListeners('deleteDocument')
    }
  })

  if (!adapter || !currentCollection) {
    console.log(adapter, currentCollection)
    return null
  }

  return (
    <InstantSearch searchClient={adapter.searchClient} indexName={currentCollection!.schema.name}>
      <div id="top">
        <SearchBox />
        <CurrentRefinements />
        <Stats />
      </div>
      <div id="middle" className="grow relative flex">
        <div id="refinements" className="relative">
          <div className="scroll-containter-y">
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
        </div>
        <div id="results" className="grow relative">
          <div className="absolute inset-0 scroll-container-y">
            <LoadMoreHits component={Tabular} />
          </div>
        </div>
      </div>
    </InstantSearch>
  )
}
