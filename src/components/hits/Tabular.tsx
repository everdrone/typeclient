import React from 'react'
import { ipcRenderer } from 'electron'

import { Highlight } from 'react-instantsearch-dom'
import { Link } from 'react-router-dom'

import useStore from 'lib/store'
import { GenericObject } from 'lib/store/types'
import Button from 'components/Button'

const ignoreKeys = ['objectID', '__position', '_snippetResult', '_highlightResult', 'text_match']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Tabular({ hit }: GenericObject) {
  const [currentCollectionName] = useStore(state => [state.currentCollectionName, state.deleteDocument])

  function handleDeleteDocument() {
    ipcRenderer.invoke('confirmDeleteDocument', { collectionName: currentCollectionName, documentId: hit.objectID })
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4">
        {Object.keys(hit)
          .filter(key => !ignoreKeys.includes(key))
          .map(key => (
            <React.Fragment key={key}>
              <div className="text-right col-span-3 xl:col-span-2">{key}</div>
              <div className="col-span-9 xl:col-span-10">
                <Highlight attribute={key} hit={hit} />
              </div>
            </React.Fragment>
          ))}
      </div>
      <div className="flex">
        <Link to={`/documents/edit/${hit.id}`}>
          <Button text="Edit" />
        </Link>
        <Button className="destructive" onClick={handleDeleteDocument} text="Delete" />
      </div>
    </>
  )
}

export default function Tabular2({ hit }: GenericObject) {
  return (
    <>
      <div className="grid grid-cols-12 gap-x-4">
        {Object.keys(hit)
          .filter(key => !ignoreKeys.includes(key))
          .map(key => (
            <React.Fragment key={key}>
              <div className="text-right col-span-3 2xl:col-span-2">{key}</div>
              <div className="col-span-9 2xl:col-span-10">{JSON.stringify(hit[key], null, 2)}</div>
            </React.Fragment>
          ))}
      </div>
      <div className="flex">
        <Link to={`/documents/edit/${hit.id}`}>
          <Button text="Edit" />
        </Link>
        {/* <Button className="destructive" text="Delete" /> */}
      </div>
    </>
  )
}
