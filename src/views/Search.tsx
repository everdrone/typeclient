import React from 'react'
import { InstantSearch, SearchBox } from 'react-instantsearch-dom'

import useStore from 'lib/store'
import LoadMoreHits from 'components/LoadMoreHits'
import SelectCollection from 'components/SelectCollection'

const SimpleHit = ({ hit }: any) => (
  <code>
    <pre>{JSON.stringify(hit)}</pre>
  </code>
)

export default function Search() {
  // FIXME: when new collections are created, the store doesn't update
  // create a function to update the store when routes change
  console.log('Search')
  const [adapter, collections, currentCollectionName] = useStore(state => [
    state.adapter,
    state.collections,
    state.currentCollectionName,
  ])

  const currentCollection = collections[currentCollectionName]

  if (!adapter || !currentCollection) {
    return null
  }

  return (
    <InstantSearch
      searchClient={adapter.searchClient}
      indexName={currentCollection!.schema.name}
    >
      <SelectCollection />
      <SearchBox />
      <LoadMoreHits component={SimpleHit} />
    </InstantSearch>
  )
}
