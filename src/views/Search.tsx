import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { InstantSearch, SearchBox } from 'react-instantsearch-dom'

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
      </div>
      <div id="middle" className="grow relative">
        <div className="absolute inset-0 scroll-container-y">
          <LoadMoreHits component={Tabular} />
        </div>
      </div>
    </InstantSearch>
  )
}
