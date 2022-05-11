import React from 'react'
import { InstantSearch, SearchBox } from 'react-instantsearch-dom'

import useStore from 'lib/zustand'
import LoadMoreHits from 'components/LoadMoreHits'

const SimpleHit = ({ hit }: any) => (
  <code>
    <pre>{JSON.stringify(hit)}</pre>
  </code>
)

export default function Search() {
  // FIXME: when new collections are created, the store doesn't update
  // create a function to update the store when routes change
  console.log('Search')
  const [adapter, getCurrentCollection] = useStore(state => [
    state.adapter,
    state.getCurrentCollection,
  ])

  const currentCollection = getCurrentCollection()

  if (!adapter || !currentCollection) {
    return null
  }

  return (
    <InstantSearch
      searchClient={adapter.searchClient}
      indexName={currentCollection!.schema.name}
    >
      <SearchBox />
      <LoadMoreHits component={SimpleHit} />
    </InstantSearch>
  )
}
